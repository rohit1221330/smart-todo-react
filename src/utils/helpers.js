import { format, parseISO, isToday, isFuture, startOfDay, isSameDay  } from 'date-fns';
import { eachDayOfInterval } from 'date-fns'; 

/**
 * Formats an ISO date string into a more readable format.
 * e.g., "Sep 15, 2025"
 * @param {string} dateString - The ISO date string.
 * @returns {string} The formatted date.
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM d, yyyy');
    } catch (error) {
        console.error("Invalid date string:", dateString);
        return "Invalid Date";
    }
};

/**
 * Computes data for the "Tasks Completed Per Day" chart.
 * @param {Array} tasks - The list of tasks.
 * @returns {object} Data formatted for Chart.js.
 */
export const getTasksCompletedPerDay = (tasks) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return startOfDay(d);
    }).reverse();

    const labels = last7Days.map(day => format(day, 'MMM d'));
    
    const data = last7Days.map(day => {
        return tasks.filter(task => 
            task.status === 'completed' && 
            task.updated_at && 
            startOfDay(parseISO(task.updated_at)).getTime() === day.getTime()
        ).length;
    });

    return {
        labels,
        datasets: [{
            label: 'Tasks Completed',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }]
    };
};


/**
 * Filters tasks that are due soon (today or in the future).
 * @param {Array} tasks - The list of tasks.
 * @returns {Array} An array of upcoming tasks.
 */
export const getUpcomingTasks = (tasks) => {
    return tasks.filter(task => 
        task.status === 'pending' &&
        task.due_date && 
        (isToday(parseISO(task.due_date)) || isFuture(parseISO(task.due_date)))
    ).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
};

/**
 * Computes data for tasks completed over a specific time range.
 * @param {Array} tasks - The list of tasks.
 * @param {Date} startDate - The start of the range.
 * @param {Date} endDate - The end of the range.
 * @returns {object} Data formatted for Chart.js.
 */
export const getTasksCompletedOverTime = (tasks, startDate, endDate) => {
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const labels = dateRange.map(day => format(day, 'MMM d'));

    let cumulativeScore = 0;
    const dataPoints = [];

    dateRange.forEach(day => {
        // 1. Gino ki aaj kitne task complete hue (using updated_at)
        const completedCount = tasks.filter(task => 
            task.status === 'completed' && 
            task.updated_at &&
            isSameDay(parseISO(task.updated_at), day)
        ).length;

        // 2. Gino ki aaj kitne task due the, par complete nahi hue (miss ho gaye)
        const missedCount = tasks.filter(task => 
            task.due_date &&
            isSameDay(parseISO(task.due_date), day) &&
            task.status === 'pending'
        ).length;

        // 3. Aaj ka score change calculate karo
        // Har complete task ke liye +1 aur har miss hue task ke liye -0.5
        const dailyChange = completedCount - (missedCount * 0.5);

        cumulativeScore += dailyChange;

        // Score ko 0 se neeche nahi jaane denge
        cumulativeScore = Math.max(0, cumulativeScore);

        dataPoints.push(cumulativeScore);
    });

    return {
        labels,
        datasets: [{
            label: 'Growth Score',
            data: dataPoints,
            fill: true,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 200);
              gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
              gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
              return gradient;
            },
            tension: 0.3,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointRadius: 4,
        }]
    };
};


/**
 * Computes the completion percentage for tasks that are due today.
 * @param {Array} tasks - The list of all tasks.
 * @returns {number} The percentage of completed tasks that are due today.
 */
export const getTodayProgressPercentage = (tasks) => {
    // 1. Sirf un tasks ko nikalo jinka due date aaj ka hai
    const tasksDueToday = tasks.filter(task => 
        task.due_date && isToday(parseISO(task.due_date))
    );

    const totalTasksDueToday = tasksDueToday.length;
    if (totalTasksDueToday === 0) {
        return 0; // Agar aaj koi task due nahi hai
    }

    // 2. Un "aaj ke tasks" mein se, gino kitne complete ho gaye hain
    const completedTasksDueToday = tasksDueToday.filter(task => task.status === 'completed').length;
    
    const percentage = (completedTasksDueToday / totalTasksDueToday) * 100;
    return Math.round(percentage);
};