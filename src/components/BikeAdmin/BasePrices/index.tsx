import { useState } from 'react';
import {
  FormHelperText,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { FormWrapper } from '../BikeDetailAdmin/styles';
import { Flex, HStack, TPLabel, TitleOfStep, VStack, WhiteButton } from '../common/styles';
import DatePicker from '@/components/common/DatePicker';
import SelectInput from '@/components/common/SelectInput';
import dayjs, { Dayjs } from "dayjs";
import { dateFormatString } from '@/constants/services';
import { isBeforeSecondFromFirstDay } from '@/utils/helpers';
import { timeOptions } from '@/constants/options';
import { CancelIcon, DateDash, DateLabel, DatesWrapper } from '../Stepper/styles';
import { BikeData, BasePrice } from '../Stepper';
import { GrayButton, PinkButton } from '../common/ActionButtons/styles';
import { ArrowBack, ArrowForward } from '@mui/icons-material';


export function BasePriceDay ({setBasePrices}) {
  const initBasePrice = {
    fromDate: '',
    fromTime: '', 
    toDate: '',
    toTime: '',
    pricePerDay: 0
  };

  const [fromDateError, setFromDateError] = useState('');
  const [fromTimeError, setFromTimeError] = useState('');
  const [toDateError, setToDateError] = useState('');
  const [toTimeError, setToTimeError] = useState('');
  const [priceError, setPriceError] = useState('');

  const [newBasePrice, setNewBasePrice] = useState(initBasePrice)

  const validate = () => {
    let isValid = true;
  
    if (!newBasePrice.fromDate) {
      setFromDateError('From date is required');
      isValid = false;
    } else {
      setFromDateError('');
    }
  
    if (!newBasePrice.fromTime) {
      setFromTimeError('From time is required');
      isValid = false;
    } else {
      setFromTimeError('');
    }
  
    if (!newBasePrice.toDate) {
      setToDateError('To date is required');
      isValid = false;
    } else {
      setToDateError('');
    }
  
    if (!newBasePrice.toTime) {
      setToTimeError('To time is required');
      isValid = false;
    } else {
      setToTimeError('');
    }
    if (!newBasePrice.pricePerDay) {
      setPriceError('Price is required');
      isValid = false;
    } else {
      setPriceError('');
    }
  
    return isValid;
  };

  const pickUpDisabledDates = (date: Dayjs) => {
    const disableFromDay = dayjs().subtract(1, "day");
    let shouldDisable = false;

    if (
      isBeforeSecondFromFirstDay(
        disableFromDay?.format(dateFormatString),
        date.format(dateFormatString)
      )
    ) {
      shouldDisable = true;
    }

    return shouldDisable;
  };

  const handleDateChange = (value: Dayjs | null, key: string) => {
    let newValues = newBasePrice;
    const date = dayjs(value).format(dateFormatString);
    newValues[key] = date;
    setNewBasePrice(newValues);
    
    switch (key) {
      case 'fromDate':
        setFromDateError('')
        break;
      case 'toDate':
        setToDateError('')
        break;
      default:
        break;
    }
  };

  const handleTimeChange = (e: SelectChangeEvent<string>, key: string) => {
    const { value } = e.target;
    setNewBasePrice({
      ...newBasePrice,
      [key]: value
    });
    
    switch (key) {
      case 'fromTime':
        setFromTimeError('')
        break;
      case 'toTime':
        setToTimeError('')
        break;
      default:
        break;
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setNewBasePrice({
      ...newBasePrice,
      pricePerDay: Number(value)
    });

    setPriceError('')
  }

  const toTimeOptions = timeOptions.map((option) => {
    let newOption = { ...option };
    newOption.valid = true;
    return newOption;
  });

  const addBasePrice = () => {
    if (!validate()) return;
    setBasePrices(newBasePrice);
  };

  return (
    <>
      <VStack>
        <div>
          <TPLabel>From date & time</TPLabel>
          <HStack>
            <Flex flex={1}>
              <DatePicker
                className="text-input"
                onChange={value => handleDateChange(value, 'fromDate')}
                value={newBasePrice.fromDate ? dayjs(newBasePrice.fromDate) : null}
                disableDates={pickUpDisabledDates}
              />
              <FormHelperText style={{color: 'red'}}>{fromDateError}</FormHelperText>
            </Flex>
            <Flex flex={1}>
              <SelectInput
                style={{width: '100%'}}
                label="Time"
                value={newBasePrice.fromTime}
                onChange={e => handleTimeChange(e as SelectChangeEvent<any>, 'fromTime')} 
                options={toTimeOptions}
              />
              <FormHelperText style={{color: 'red'}}>{fromTimeError}</FormHelperText>
            </Flex>
          </HStack>
        </div>
        
        <div>
          <TPLabel>To date & time</TPLabel>
          <HStack>
            <Flex flex={1}>
              <DatePicker
                className="text-input"
                onChange={(value) => handleDateChange(value, "toDate")}
                value={newBasePrice.toDate ? dayjs(newBasePrice.toDate) : null}
                disableDates={pickUpDisabledDates}
              />
              <FormHelperText style={{color: 'red'}}>{toDateError}</FormHelperText>
            </Flex>
            <Flex flex={1}>
              <SelectInput
                style={{width: '100%'}}
                label="Time"
                value={newBasePrice.toTime}
                onChange={(e) => handleTimeChange(e as SelectChangeEvent<any>, "toTime")}
                options={toTimeOptions}
              />
              <FormHelperText style={{color: 'red'}}>{toTimeError}</FormHelperText>
            </Flex>
          </HStack>
        </div>

        <TextField
          type="number"
          name={`price`}
          label="Price per day"
          value={newBasePrice.pricePerDay || ''}
          onChange={(e) => handleChange(e)} 
        />
        <FormHelperText style={{color: 'red'}}>{priceError}</FormHelperText>
      </VStack>
      <HStack style={{justifyContent: 'center', marginTop: '27px', marginBottom: '40px'}}>
        <WhiteButton className='white' type="submit" onClick={addBasePrice}>
          Add
        </WhiteButton>
      </HStack>
    </>
  )
}

export function BasePricesForm({ 
  setActiveStep, 
  bikeData,
  setBikeData
}: { 
  setActiveStep: (value: any) => void; 
  bikeData: BikeData;
  setBikeData: (bikeData: BikeData) => void;
}) {

  const [basePrices, setBasePrices] = useState<BasePrice[]>(bikeData.basePrices);
  // const [basePricesError, setBasePricesError] = useState('');

  const removeBasePrice = (index: number) => {
    setBasePrices(prevBasePrices => prevBasePrices.filter((_, i) => i !== index));
  };

  const onSetBasePrices = (newBasePrice: BasePrice) => {
    setBasePrices(prevBasePrices => [...prevBasePrices, {
      ...newBasePrice
    }]);
    // setBasePricesError('');
  }

  const onNext = () => {
    /* if (!basePrices.length) {
      setBasePricesError('Please add one more Fixed price.')
    } else {
      setBasePricesError('') */
    setBikeData({
      ...bikeData,
      basePrices
    })
    setActiveStep(4)
    // }
  }

  return (
    <FormWrapper>
      <TitleOfStep>Fixed prices</TitleOfStep>
      <BasePriceDay setBasePrices={(newBasePrice) => onSetBasePrices(newBasePrice)} />
      {basePrices.map((day, index) => (
        <DatesWrapper key={index} borderBottom={basePrices.length - 1 === index}>
          <HStack>
            <div>
              <DateLabel>
                {day.fromDate} | {day.fromTime}<DateDash />
              </DateLabel>
              <DateLabel style={{marginTop: '5'}}>${day.pricePerDay}</DateLabel>
            </div>
            <DateLabel style={{marginLeft: '50px'}}>{day.toDate} | {day.toTime}</DateLabel>
          </HStack>
          <CancelIcon onClick={() => removeBasePrice(index)} />
        </DatesWrapper>
      ))}
      <VStack style={{marginTop: '39px', alignItems: 'center'}}>
        {/* <FormHelperText style={{color: 'red'}}>{basePricesError}</FormHelperText> */}
        <HStack style={{justifyContent: 'center'}}>
          <GrayButton className='gray' onClick={() => setActiveStep(2)} variant="contained" startIcon={<ArrowBack />}>Back</GrayButton>
          <PinkButton className='pink' onClick={onNext} variant="contained" endIcon={<ArrowForward />}>Next</PinkButton>
        </HStack>
      </VStack>
    </FormWrapper>
  )
}