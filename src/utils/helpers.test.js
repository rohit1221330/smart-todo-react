import { getPercentageCompletedToday } from './helpers';
import { subDays, startOfToday } from 'date-fns';

describe('getPercentageCompletedToday', () => {
    const today = startOfToday().toISOString();
    const yesterday = subDays(new Date(), 1).toISOString();

    test('should return 0 if there are no tasks for today', () => {
        const tasks = [
            { id: 1, due_date: yesterday, status: 'completed' }
        ];
        expect(getPercentageCompletedToday(tasks)).toBe(0);
    });

    test('should return 50 if half of today\'s tasks are completed', () => {
        const tasks = [
            { id: 1, due_date: today, status: 'completed' },
            { id: 2, due_date: today, status: 'pending' },
            { id: 3, due_date: yesterday, status: 'completed' }
        ];
        expect(getPercentageCompletedToday(tasks)).toBe(50);
    });

    test('should return 100 if all of today\'s tasks are completed', () => {
         const tasks = [
            { id: 1, due_date: today, status: 'completed' },
            { id: 2, due_date: today, status: 'completed' },
        ];
        expect(getPercentageCompletedToday(tasks)).toBe(100);
    });
});