const Transaction = require('../models/Transaction');
const axios = require('axios');

// Initialize database with seed data
const initializeDatabase = async (req, res) => {
    try {
        const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.deleteMany(); // Clear existing data
        await Transaction.insertMany(data);
        res.status(200).json({ message: 'Database initialized successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to initialize database' });
    }
};

// Fetch paginated transactions with optional search
const getTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;
    const regex = new RegExp(search, 'i');
    const monthFilter = month ? { $expr: { $eq: [{ $month: '$dateOfSale' }, Number(month)] } } : {};

    try {
        const transactions = await Transaction.find({
            ...monthFilter,
            $or: [
                { title: regex },
                { description: regex },
                { price: regex },
            ],
        })
            .skip((page - 1) * perPage)
            .limit(Number(perPage));
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

// Fetch statistics for a given month
const getStatistics = async (req, res) => {
    const { month } = req.query;
    const monthFilter = { $expr: { $eq: [{ $month: '$dateOfSale' }, Number(month)] } };

    try {
        const totalSales = await Transaction.aggregate([
            { $match: monthFilter },
            { $group: { _id: null, total: { $sum: '$price' } } },
        ]);

        const soldCount = await Transaction.countDocuments({ ...monthFilter, sold: true });
        const unsoldCount = await Transaction.countDocuments({ ...monthFilter, sold: false });

        res.json({
            totalSales: totalSales[0]?.total || 0,
            soldCount,
            unsoldCount,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

// Fetch bar chart data
const getBarChart = async (req, res) => {
    const { month } = req.query;
    const monthFilter = { $expr: { $eq: [{ $month: '$dateOfSale' }, Number(month)] } };

    try {
        const priceRanges = await Transaction.aggregate([
            { $match: monthFilter },
            {
                $bucket: {
                    groupBy: '$price',
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    default: '901+',
                    output: { count: { $sum: 1 } },
                },
            },
        ]);
        res.json(priceRanges);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bar chart data' });
    }
};

// Fetch pie chart data
const getPieChart = async (req, res) => {
    const { month } = req.query;
    const monthFilter = { $expr: { $eq: [{ $month: '$dateOfSale' }, Number(month)] } };

    try {
        const categories = await Transaction.aggregate([
            { $match: monthFilter },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pie chart data' });
    }
};

// Combine all API responses
const getCombinedData = async (req, res) => {
    const { month } = req.query;
    try {
        const statistics = await getStatistics(req, res);
        const barChart = await getBarChart(req, res);
        const pieChart = await getPieChart(req, res);

        res.json({
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch combined data' });
    }
};

module.exports = {
    initializeDatabase,
    getTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getCombinedData,
};
