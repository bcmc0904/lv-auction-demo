import moment from 'moment';
import numeral from 'numeral';
import {DEFAULT_DATETIME_FORMAT, DEFAULT_NUMBER_FORMAT, DEFAULT_CURRENCY_FORMAT} from '@/utils/const';
// load a locale
numeral.register('locale', 'vn', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'n',
    million: 'tr',
    billion: 't',
    trillion: 'nt'
  },
  currency: {
    symbol: 'VNĐ'
  },
  ordinal : function (number) {
    return '';
  }
});

// switch between locales
numeral.locale('vn');
// load a format
numeral.register('format', 'vnd', {
  regexps: {
    format: /(vnd)/,
    unformat: /(vnd)/
  },
  format: function(value, format, roundingFunction) {
    // @ts-ignore
    var space = numeral._.includes(format, 'vnd ') ? ' ' : '',
      output;

    // check for space after
    format = format.replace(/vnd\s?/, '');

    output = numeral._.numberToFormat(value, format, roundingFunction);

    // @ts-ignore
    if (numeral._.includes(output, ')')) {
      output = output.split('');

      output.splice(-1, 0, space + ' VNĐ');

      output = output.join('');
    } else {
      output = output + space + ' VNĐ';
    }

    return output;
  },
  unformat: function(string) {
    return numeral._.stringToNumber(string) * 0.01;
  }
});
export function dateTimeFormat(time: number) {
  return moment(time * 1000).format(DEFAULT_DATETIME_FORMAT)
}

export function numberFormat(num: number, currency: boolean = false) {
  if (currency) return numeral(num).format(DEFAULT_CURRENCY_FORMAT)

  return numeral(num).format(DEFAULT_NUMBER_FORMAT)
}
