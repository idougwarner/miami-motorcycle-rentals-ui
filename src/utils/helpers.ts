import { BasePrice } from "@/components/BikeAdmin/Stepper";
import { timeOptions } from "@/constants/options";
import { dateFormatString, dateTimeFormatString } from "@/constants/services";
import { BikeDiscountPercentage, OffDay, Options, RentalDetails, TimeOptions } from "@/types";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Router from "next/router";
import { ParsedUrlQueryInput } from "querystring";
dayjs.extend(customParseFormat);

export const convertTitleToLink = (title: string) => {
  return title?.toLocaleLowerCase()?.replaceAll(" ", "-").replaceAll(":", "");
};

export const convertTitleToId = (title: string) => {
  return title.toLocaleLowerCase().replaceAll(" ", "_");
};

export const changePathWithoutRerender = (
  pathname: string,
  query: ParsedUrlQueryInput
) => {
  Router.push(
    {
      pathname,
      query,
    },
    undefined,
    { shallow: true }
  );
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const validEmail = (value: string) => {
  return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "Email is not correct."
    : "";
};

export const validPhoneNumber = (value: string) => {
  return !value.match("[0-9]{10}") ? "Phone number is invalid." : "";
};

export const isBeforeSecondFromFirstDay = (
  firstDay: string = "",
  secondDay: string = ""
) => {
  return formattedDayjs(secondDay).isBefore(
    formattedDayjs(firstDay).add(10, "minute")
  );
};

export const isAfterSecondFromFirstDay = (
  firstDay: string = "",
  secondDay: string = ""
) => {
  return formattedDayjs(secondDay).isAfter(
    formattedDayjs(firstDay).subtract(10, "minute")
  );
};

export const isDateInRange = (date: Dayjs, day1: string, day2: string) => {
  return date.isBetween(day1, day2, "day", "()");
};

export const getDuration = (upDay: string = "", offDay: string = "") => {
  return Math.ceil(
    formattedDayjs(offDay)
      .add(30, "minute")
      .diff(formattedDayjs(upDay), "hour") / 24
  );
};

/**
 * 
 * @param date : YYYY-MM-DD: HH:mm A | YYYY-MM-DD
 * @param time HH:mm A (ex: 7:00 PM)
 * @returns Dayjs
 */
export const formattedDayjs = (date: string, time?: string) => {
  if (time) {
    return dayjs(`${date}: ${time}`, dateTimeFormatString);
  } 
  return dayjs(date, dateTimeFormatString);
};

export const formattedDate = (date: string) => {
  return dayjs(date, dateFormatString);
};

export const getDiscountPrice = (duration: number, initialPrice: number, discountPercentage: BikeDiscountPercentage) => {
  if (duration === 2) return (initialPrice * (1 - (discountPercentage.two / 100))).toFixed(2);
  if (duration === 3) return (initialPrice * (1 - (discountPercentage.three / 100))).toFixed(2);
  if (duration === 4) return (initialPrice * (1 - (discountPercentage.four / 100))).toFixed(2);
  if (duration > 4) return (initialPrice * (1 - (discountPercentage.five / 100))).toFixed(2);
  return initialPrice;
};

export const replaceDepositInDescription = (
  description: string,
  deposit: number
) => {
  return description.replace("${deposit}", `$${deposit}`);
};

export const parseDiscountPercentages = (discountPercentage: string = '') => {
  // Log the raw JSON string
  const cleanedString = discountPercentage.replace(/'/g, '"');
  try {
    // Try parsing the cleaned string
    const jsonObject = JSON.parse(cleanedString);
    return jsonObject as number;
  } catch (error) {
    return null;
  }
}

export const currentPriceByDiscount = (regularPrice: number, discountPercentage: number) => {
  return regularPrice * (1 - (discountPercentage / 100))
}

export const isInFixedPriceRange = (basePrice: BasePrice, rentalDetails: RentalDetails) => {
  const basePriceStart = dayjs(`${basePrice.fromDate}T${dayjs(basePrice.fromTime, 'hh:mm A').format('HH:mm')}`);
  const basePriceEnd = dayjs(`${basePrice.toDate}T${dayjs(basePrice.toTime, 'hh:mm A').format('HH:mm')}`);
  const pickUpDateTime = dayjs(`${rentalDetails.pickUpDate}T${dayjs(rentalDetails.pickUpTime, 'hh:mm A').format('HH:mm')}`);
  const dropOffDateTime = dayjs(`${rentalDetails.dropOffDate}T${dayjs(rentalDetails.dropOffTime, 'hh:mm A').format('HH:mm')}`);

  return (pickUpDateTime.isAfter(basePriceStart) || pickUpDateTime.isSame(basePriceStart)) && 
         (dropOffDateTime.isBefore(basePriceEnd) || dropOffDateTime.isSame(basePriceEnd));
}

export const generateSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

/**
 * 
 * @param optionDay Dayjs
 * @param offDays OffDay[]
 * @returns 
 */
const isInDateTimeRange = (optionDay: Dayjs, offDays: OffDay[]) => {
  const date = optionDay;

  for (let range of offDays) {
    const startDate = formattedDayjs(range.fromDate, range.fromTime).subtract(30, "minute");
    const endDate = formattedDayjs(range.toDate, range.toTime).add(30, "minute");

    // Check if 'date' is between 'startDate' and 'endDate'
    if (date.isBetween(startDate, endDate, null, '[]')) { // '[]' indicates inclusive of the start and end dates
      return true;
    }
  }

  return false;
}

const isValidToDateByFromDateTime = (timeOptions: TimeOptions[], newOffDay: OffDay, toDate: Dayjs) => {
  const lastFromTimeOfNewOffDay = timeOptions[timeOptions.length - 1];

  if (lastFromTimeOfNewOffDay?.value !== '10:00 PM') {
    if (toDate.format('YYYY-MM-DD') === newOffDay.fromDate) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

const isInValidToDate = (
  toTimeValidOptions: TimeOptions[], 
  fromTimeValidOptions: TimeOptions[], 
  newOffDay: OffDay, 
  date: Dayjs
) => {
  return toTimeValidOptions.length === 0 || !isValidToDateByFromDateTime(fromTimeValidOptions, newOffDay, date);
}

const isValidFromTime = (optionDay: Dayjs, offDays: OffDay[]) => {
  return !(
    !optionDay.isValid() || // is selected date
    optionDay.isBefore(dayjs().add(10, 'minute')) || // is not now + 10min
    isInDateTimeRange(optionDay, offDays) // not in booked time range +- 30min
  );
}

const isValidToTime = (optionDay: Dayjs, offDays: OffDay[], newOffDay: OffDay) => {
  return (
    isValidFromTime(optionDay, offDays) && 
    !optionDay.isBefore(formattedDayjs(newOffDay.fromDate, newOffDay.fromTime).add(30, 'minute')))
}

const getFromTimeValidOptions = (date: Dayjs, offDays: OffDay[]) => (timeOptions.map((option) => {
  const optionDay = formattedDayjs(date.format('YYYY-MM-DD'), option.value);

  return {
    ...option,
    valid: isValidFromTime(optionDay, offDays)
  };
}).filter(el => el.valid));

export const getToTimeValidOptions = (date: Dayjs, offDays: OffDay[], newOffDay: OffDay) => (timeOptions.map((option) => {
  const optionDay = formattedDayjs(date.format('YYYY-MM-DD'), option.value);

  return {
    ...option,
    valid: isValidToTime(optionDay, offDays, newOffDay)
  };
}).filter(el => el.valid));

const disabledDateByInValidTime = (name: string, date: Dayjs, offDays: OffDay[], newOffDay?: OffDay): boolean => {
  const timeValidOptions = (name === 'fromDate' ? 
    getFromTimeValidOptions(date, offDays) : 
    getToTimeValidOptions(date, offDays, newOffDay));
    
  if (name === 'fromDate') {
    return timeValidOptions.length <= 1;
  } else {
    const selectedValidFromTimeOptions = getFromTimeValidOptions(dayjs(newOffDay.fromDate), offDays);

    return isInValidToDate(timeValidOptions, selectedValidFromTimeOptions, newOffDay, date)
  }
}

export const disableDates = (date: Dayjs, name: string, newOffDay: OffDay, offDays: OffDay[]) => {
  return dayjs(date).isBefore(dayjs(), 'day') ||  // before now
        (name === 'toDate' && dayjs(date).isBefore(newOffDay.fromDate)) || // toTime is before fromTime
        offDays.some(offDay => 
          dayjs(date).isBetween(offDay.fromDate, offDay.toDate, 'day', '()')
        ) || // in booked day range ex: booked = 21 ~ 23 ? 22 is disable
        disabledDateByInValidTime(name, date, offDays, newOffDay) // disable DateByTime
};

export const getFromTimeOptions = (newOffDay: OffDay, offDays: OffDay[]): Options[] => (
  timeOptions.map((option) => {
    const optionDay = formattedDayjs(newOffDay.fromDate, option.value);
  
    return {
      ...option,
      valid: isValidFromTime(optionDay, offDays)
    };
  })
)

export const getToTimeOptions = (newOffDay: OffDay, offDays: OffDay[]): Options[] => {
  return timeOptions.map((option) => {
    const optionDay = formattedDayjs(newOffDay.toDate, option.value);
  
    return {
      ...option,
      valid: isValidToTime(optionDay, offDays, newOffDay)
    };
  });
}