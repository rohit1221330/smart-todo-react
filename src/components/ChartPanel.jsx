// src/components/ChartPanel.jsx

import React, { useState, useMemo } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { getTasksCompletedOverTime, getTodayProgressPercentage } from '../utils/helpers';
import { useTasks } from '../hooks/useTasks';
import { subDays, startOfToday, endOfToday, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

// Chart.js ke naye elements register karein
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const ChartPanel = () => {
    const { tasks } = useTasks();
    const [timeRange, setTimeRange] = useState('7d'); // '7d', '30d', 'custom'
    const [customRange, setCustomRange] = useState({
        start: formatForInput(subDays(new Date(), 7)),
        end: formatForInput(new Date()),
    });

    // Date range ke hisaab se data ko recalculate karne ke liye useMemo
    const lineChartData = useMemo(() => {
        let startDate, endDate;
        const today = new Date();

        if (timeRange === '7d') {
            startDate = subDays(today, 6);
            endDate = today;
        } else if (timeRange === '30d') {
            startDate = subDays(today, 29);
            endDate = today;
        } else { // Custom range
            startDate = parseISO(customRange.start);
            endDate = parseISO(customRange.end);
        }

        return getTasksCompletedOverTime(tasks, startDate, endDate);
    }, [tasks, timeRange, customRange]);

    const percentageToday = getTodayProgressPercentage(tasks);
    const doughnutChartData = {
        labels: ['Completed', 'Pending'],
        datasets: [{
            data: [percentageToday, 100 - percentageToday],
            backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.6)'],
            borderColor: 'transparent',
            borderWidth: 0,
        }],
    };

    // Helper function for date input format
    function formatForInput(date) {
        return date.toISOString().split('T')[0];
    }

    return (
        <motion.div
            className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            {/* Line Chart Section */}
            <div className="p-5 border rounded-xl bg-slate-900/70 border-slate-700 backdrop-blur-sm lg:col-span-3">
                <div className="flex flex-col items-start justify-between gap-4 mb-4 sm:flex-row sm:items-center">
                    <h2 className="text-lg font-semibold text-slate-100">Your Progress</h2>
                    <div className="flex p-1 space-x-1 rounded-lg bg-slate-800/50">
                        {['7d', '30d', 'custom'].map(range => (
                            <button key={range} onClick={() => setTimeRange(range)} className={`relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md ${timeRange === range ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                                {timeRange === range && <motion.span layoutId="time-range-highlight" className="absolute inset-0 rounded-md bg-info/80" transition={{ type: 'spring', stiffness: 200, damping: 25 }} />}
                                <span className="relative z-10 capitalize">{range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'Custom'}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {timeRange === 'custom' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-2 mb-4">
                        <input type="date" value={customRange.start} onChange={e => setCustomRange({ ...customRange, start: e.target.value })} className="w-full text-sm input bg-slate-800/50 border-slate-700" />
                        <span className="text-slate-400">to</span>
                        <input type="date" value={customRange.end} onChange={e => setCustomRange({ ...customRange, end: e.target.value })} className="w-full text-sm input bg-slate-800/50 border-slate-700" />
                    </motion.div>
                )}

                <div className="h-64">
                    <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } } } }} />
                </div>
            </div>

            {/* Doughnut Chart Section */}
            <div className="p-5 border rounded-xl bg-slate-900/70 border-slate-700 backdrop-blur-sm lg:col-span-2">
                {/* CHANGE 3: Title ko wapas update kiya */}
                <h2 className="mb-4 text-lg font-semibold text-slate-100">Today's Snapshot</h2>
                <div className="relative flex items-center justify-center h-64">
                    <Doughnut data={doughnutChartData} options={{ responsive: true, cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }} />
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-slate-100">{percentageToday}%</span>
                        <span className="text-sm text-slate-400">Due Today</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ChartPanel;