import dayjs from 'dayjs/esm';
import isoWeek from 'dayjs/esm/plugin/isoWeek';
import quarterOfYear from 'dayjs/esm/plugin/quarterOfYear';
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

import { _adapters } from 'chart.js';

const FORMATS = {
  datetime: 'MMM D, YYYY, h:mm:ss a',
  millisecond: 'h:mm:ss.SSS a',
  second: 'h:mm:ss a',
  minute: 'h:mm a',
  hour: 'hA',
  day: 'MMM D',
  week: 'll',
  month: 'MMM YYYY',
  quarter: '[Q]Q - YYYY',
  year: 'YYYY',
};

_adapters._date.override(
  typeof dayjs === 'function'
    ? {
        // @ts-expect-error
        _id: 'dayjs', // DEBUG ONLY

        formats() {
          return FORMATS;
        },

        parse(value, format) {
          if (value === null || typeof value === 'undefined') {
            return null;
          }

          const type = typeof value;

          if (type === 'number' || value instanceof Date) {
            value = dayjs(value as number | Date);
          } else if (type === 'string') {
            if (typeof format === 'string') {
              value = dayjs(value as string, format);
            } else {
              value = dayjs(value as string);
            }
          }

          return (value as dayjs.Dayjs).isValid()
            ? (value as dayjs.Dayjs).valueOf()
            : null;
        },

        format: function (time, format) {
          return dayjs(time).format(format);
        },

        add: function (time, amount, unit) {
          return dayjs(time).add(amount, unit).valueOf();
        },

        diff: function (max, min, unit) {
          return dayjs(max).diff(dayjs(min), unit);
        },

        startOf: function (time, unit, weekday) {
          const timeWrapped = dayjs(time);

          if (unit === 'isoWeek' && !!weekday) {
            weekday = Math.trunc(Math.min(Math.max(0, weekday), 6));

            return timeWrapped.isoWeekday(weekday).startOf('day').valueOf();
          }

          //@ts-expect-error
          return timeWrapped.startOf(unit).valueOf();
        },

        endOf: function (time, unit) {
          //@ts-expect-error
          return dayjs(time).endOf(unit).valueOf();
        },
      }
    : {},
);
