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
import { timeOptions } from '@/constants/options';
import { CancelIcon, DateDash, DateLabel, DatesWrapper } from '../Stepper/styles';
import { BikeData } from '../Stepper';
import { GrayButton, PinkButton } from '../common/ActionButtons/styles';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { OffDay } from '@/types';
import { disableDates, getFromTimeOptions, getToTimeOptions } from '@/utils/helpers';


export function SelectOffDay ({offDays, setOffDays}: {offDays: OffDay[], setOffDays: (offDay: OffDay) => void}) {
  const initNewOffDay = {
    fromDate: '',
    fromTime: '', 
    toDate: '',
    toTime: '',
    description: '' 
  };

  const [fromDateError, setFromDateError] = useState('');
  const [fromTimeError, setFromTimeError] = useState('');
  const [toDateError, setToDateError] = useState('');
  const [toTimeError, setToTimeError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const [newOffDay, setNewOffDay] = useState<OffDay>(initNewOffDay)

  const validate = () => {
    let isValid = true;
  
    if (!newOffDay.fromDate) {
      setFromDateError('From date is required');
      isValid = false;
    } else {
      setFromDateError('');
    }
  
    if (!newOffDay.fromTime) {
      setFromTimeError('From time is required');
      isValid = false;
    } else {
      setFromTimeError('');
    }
  
    if (!newOffDay.toDate) {
      setToDateError('To date is required');
      isValid = false;
    } else {
      setToDateError('');
    }
  
    if (!newOffDay.toTime) {
      setToTimeError('To time is required');
      isValid = false;
    } else {
      setToTimeError('');
    }
    if (!newOffDay.description) {
      setDescriptionError('Description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }
  
    return isValid;
  };

  const handleDateChange = (value: Dayjs | null, key: string) => {
    let newValues = {...newOffDay};
    const date = dayjs(value).format(dateFormatString);
    newValues[key] = date;
    setNewOffDay(newValues);
    
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
    setNewOffDay({
      ...newOffDay,
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
    setNewOffDay({
      ...newOffDay,
      description: value
    });

    setDescriptionError('')
  }

  const fromTimeOptions = getFromTimeOptions(newOffDay, offDays);
  const toTimeOptions = getToTimeOptions(newOffDay, offDays);

  const addOffDay = () => {
    if (!validate()) return;
    setNewOffDay(initNewOffDay);
    setOffDays(newOffDay);
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
                value={newOffDay.fromDate ? dayjs(newOffDay.fromDate) : null}
                disableDates={(date) => disableDates(date, 'fromDate', newOffDay, offDays)}
              />
              <FormHelperText style={{color: 'red'}}>{fromDateError}</FormHelperText>
            </Flex>
            <Flex flex={1}>
              <SelectInput
                style={{width: '100%'}}
                label="Time"
                value={newOffDay.fromTime}
                onChange={e => handleTimeChange(e as SelectChangeEvent<any>, 'fromTime')} 
                options={fromTimeOptions}
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
                value={newOffDay.toDate ? dayjs(newOffDay.toDate) : null}
                disableDates={(date) => disableDates(date, 'toDate', newOffDay, offDays)}
              />
              <FormHelperText style={{color: 'red'}}>{toDateError}</FormHelperText>
            </Flex>
            <Flex flex={1}>
              <SelectInput
                style={{width: '100%'}}
                label="Time"
                value={newOffDay.toTime}
                onChange={(e) => handleTimeChange(e as SelectChangeEvent<any>, "toTime")}
                options={toTimeOptions}
              />
              <FormHelperText style={{color: 'red'}}>{toTimeError}</FormHelperText>
            </Flex>
          </HStack>
        </div>

        <TextField
          name={`description`}
          label="Description"
          value={newOffDay.description}
          onChange={(e) => handleChange(e)} 
        />
        <FormHelperText style={{color: 'red'}}>{descriptionError}</FormHelperText>
      </VStack>
      <HStack style={{justifyContent: 'center', marginTop: '27px', marginBottom: '40px'}}>
        <WhiteButton className='white' type="submit" onClick={addOffDay}>
          Add
        </WhiteButton>
      </HStack>
    </>
  )
}

export function OffDaysForm({ 
  setActiveStep, 
  bikeData,
  setBikeData
}: { 
  setActiveStep: (value: any) => void; 
  bikeData: BikeData;
  setBikeData: (bikeData: BikeData) => void;
}) {

  const [offDays, setOffDays] = useState<OffDay[]>(bikeData.offDays);
  // const [offDaysError, setOffDaysError] = useState('');

  const removeOffDay = (index: number) => {
    setOffDays(prevOffDays => prevOffDays.filter((_, i) => i !== index));
  };

  const onSetOffDays = (newOffDay: OffDay) => {
    setOffDays(prevOffDays => [...prevOffDays, {
      ...newOffDay
    }]);
    // setOffDaysError('');
  }

  const onNext = () => {
    /* if (!offDays.length) {
      setOffDaysError('Please add one more Blocked off day.')
    } else { */
      // setOffDaysError('')
    setBikeData({
      ...bikeData,
      offDays
    })
    setActiveStep(3)
    // }
  }

  return (
    <FormWrapper>
      <TitleOfStep>Blocked off days</TitleOfStep>
      <SelectOffDay offDays={offDays} setOffDays={(newOffDay) => onSetOffDays(newOffDay)} />
      {offDays.map((day, index) => (
        <DatesWrapper key={index} borderBottom={offDays.length - 1 === index}>
          <HStack>
            <div>
              <DateLabel>
                {day.fromDate} | {day.fromTime}<DateDash />
              </DateLabel>
              <DateLabel style={{marginTop: '5'}}>{day.description}</DateLabel>
            </div>
            <DateLabel style={{marginLeft: '50px'}}>{day.toDate} | {day.toTime}</DateLabel>
          </HStack>
          <CancelIcon onClick={() => removeOffDay(index)} />
        </DatesWrapper>
      ))}
      <VStack style={{marginTop: '39px', alignItems: 'center'}}>
        {/* <FormHelperText style={{color: 'red'}}>{offDaysError}</FormHelperText> */}
        <HStack style={{justifyContent: 'center'}}>
          <GrayButton className="gray" onClick={() => setActiveStep(1)} variant="contained" startIcon={<ArrowBack />}>Back</GrayButton>
          <PinkButton className="pink" onClick={onNext} variant="contained" endIcon={<ArrowForward />}>Next</PinkButton>
        </HStack>
      </VStack>
    </FormWrapper>
  )
}