import { useFormik } from 'formik';
import * as yup from 'yup';
import { 
  TextField,
  RadioGroup, 
  FormControlLabel, 
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormWrapper } from './styles';
import { TitleOfStep, VStack } from '../common/styles';
import { useEffect, useState } from 'react';
import SelectInput from '@/components/common/SelectInput';
import Editor from 'react-simple-wysiwyg';
import { BikeData } from '../Stepper';
import { extraOptions, featureOptions, highlightOptions } from '../constants';
import { simplifyHtmlContent } from '@/utils/simplifyHtmlContent';
import { generateSlug } from '@/utils/helpers';

interface SelectItemPros {
  label: string;
  value: number | string
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  slug: yup.string().matches(/^[A-Za-z0-9-]+$/, 'Slug can only contain letters, numbers, and dashes').required('Slug is required'),
  model: yup.string().required('Model is required'),
  regularPrice: yup.number().required('Regular price is required').positive('Must be positive number'),
  description: yup.string().required('Description is required'),
  typeId: yup.number().required('Type ID is required').positive('Must be positive number'),
  brandId: yup.number().required('Brand ID is required').positive('Must be positive number'),
  twoDaysDiscount: yup.number().required('2 days price is required').positive('Must be positive number'),
  threeDaysDiscount: yup.number().required('3 days price is required').positive('Must be positive number'),
  fourDaysDiscount: yup.number().required('4 days price is required').positive('Must be positive number'),
  fiveDaysDiscount: yup.number().required('5+ days price is required').positive('Must be positive number'),
  distanceIncluded: yup.string().required('Distance included is required'),
  highlights: yup.array().required('Highlights are required'),
  features: yup.array().required('Features are required'),
  extras: yup.array().required('Extras are required'),
  status: yup.string().required('Status is required'), 
  position: yup.number().required('Position is required')
});

export function BikeDetailAdmin(
  { setActiveStep, bikeData, setBikeData, children: ActionButtons }:
  { setActiveStep: (value: any) => void; bikeData: BikeData, setBikeData: (bikeData: BikeData) => void; children: JSX.Element}) 
{
  const formik = useFormik({
    initialValues: bikeData.bike,
    validationSchema: validationSchema,
    onSubmit: values => {
      setBikeData({
        ...bikeData,
        bike: {
          ...values,
          description: simplifyHtmlContent(values.description)
        }
      })
      setActiveStep(1);
    }
  });

  const [bikeTypeOptions, setBikeTypeOptions] = useState<SelectItemPros[]>([]);
  const [brandOptions, setBrandOptions] = useState<SelectItemPros[]>([]);
  const [discountPercentageOpen, setDiscountPercentageOpen] = useState<boolean>(false);

  useEffect(() => {
    const getBikeTypes = () => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/types`)
        .then(res => res.json())
        .then(data => {
          setBikeTypeOptions(data.data.map(type => ({ 
            label: type.name, 
            value: type.id 
          })));
        });
    }
    
    const getBrands = () => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/brands?isAll=1`)
        .then(res => res.json())
        .then(data => {
          setBrandOptions(data.data.map(brand => ({ 
            label: brand.name, 
            value: brand.id 
          })));
        });
    }
    
    getBikeTypes();
    getBrands();
  }, []);

  useEffect(() => {
    if (formik.values.name) {
      const generatedSlug = generateSlug(formik.values.name);
      
      formik.setFieldValue("slug", generatedSlug);
      formik.setFieldTouched("slug");
    }
  }, [formik.values.name]);

  const handleDiscountPercentageCollapse = () => {
    setDiscountPercentageOpen(!discountPercentageOpen);
  };

  return (
    <FormWrapper>
      <TitleOfStep>Add Motorcycle details</TitleOfStep>
      <form onSubmit={formik.handleSubmit}>
        <VStack>
          <TextField
            name="name"
            label="Motorcycle Name*"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}  
          />
          <TextField
            name="slug"
            label="Motorcycle Slug*"
            value={formik.values.slug}
            onChange={formik.handleChange}
            error={formik.touched.slug && Boolean(formik.errors.slug)}
            helperText={formik.touched.slug && formik.errors.slug}  
          />
          <SelectInput
            className="text-input"
            label="Bike Type"
            name="typeId"
            value={formik.values.typeId}
            onChange={formik.handleChange}
            options={bikeTypeOptions}
            error={formik.touched.typeId && Boolean(formik.errors.typeId)}
            helperText={formik.touched.typeId && formik.errors.typeId}
            required={false}
          />
          <SelectInput
            className="text-input"
            label="Bike Brand"
            name="brandId"
            value={formik.values.brandId}
            onChange={formik.handleChange}
            options={brandOptions}
            error={formik.touched.brandId && Boolean(formik.errors.brandId)}
            helperText={formik.touched.brandId && formik.errors.brandId}
            required={false}
          />
          <TextField 
            name="model"
            label="Model"
            value={formik.values.model}
            onChange={formik.handleChange}
            error={formik.touched.model && Boolean(formik.errors.model)}
            helperText={formik.touched.model && formik.errors.model}  
          />
          <TextField 
            name="regularPrice"
            label="Regular Price"
            type="number"
            value={formik.values.regularPrice}
            onChange={formik.handleChange}
            error={formik.touched.regularPrice && Boolean(formik.errors.regularPrice)}
            helperText={formik.touched.regularPrice && formik.errors.regularPrice}  
          />
          <FormControl fullWidth error={formik.touched.description && Boolean(formik.errors.description)}>
            <FormLabel component="legend">Description</FormLabel>
            <Editor
              value={formik.values.description.replace(/(\r\n|\n)/g, '<div><br/></div>')}
              onChange={(e) => {
                formik.setFieldValue("description", e.target.value);
              }}
            />
            {formik.touched.description && formik.errors.description ? (
              <FormHelperText>{formik.errors.description}</FormHelperText>
            ) : null}
          </FormControl>
          
          <IconButton 
            onClick={handleDiscountPercentageCollapse} 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            sx={{
              '&:hover': {
                borderRadius: '3px',
              },
            }}
          >
            <Typography>Discount Percentage</Typography>
            <ExpandMoreIcon style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
          </IconButton>
          <Collapse in={discountPercentageOpen}>
            <VStack style={{width: '200px', marginLeft: '18px'}}>
              <TextField
                name="twoDaysDiscount"
                label="2 days"
                type="number"
                value={formik.values['twoDaysDiscount']}
                onChange={formik.handleChange}
                error={formik.touched['twoDaysDiscount'] && Boolean(formik.errors['twoDaysDiscount'])}
                helperText={formik.touched['twoDaysDiscount'] && formik.errors['twoDaysDiscount']}
              />
              <TextField
                name="threeDaysDiscount"
                label="3 days"
                type="number"
                value={formik.values['threeDaysDiscount']}
                onChange={formik.handleChange}
                error={formik.touched['threeDaysDiscount'] && Boolean(formik.errors['threeDaysDiscount'])}
                helperText={formik.touched['threeDaysDiscount'] && formik.errors['threeDaysDiscount']}
              />
              <TextField
                name="fourDaysDiscount"
                label="4 days"
                type="number"
                value={formik.values['fourDaysDiscount']}
                onChange={formik.handleChange}
                error={formik.touched['fourDaysDiscount'] && Boolean(formik.errors['fourDaysDiscount'])}
                helperText={formik.touched['fourDaysDiscount'] && formik.errors['fourDaysDiscount']}
              />
              <TextField
                name="fiveDaysDiscount"
                label="+5 days"
                type="number"
                value={formik.values['fiveDaysDiscount']}
                onChange={formik.handleChange}
                error={formik.touched['fiveDaysDiscount'] && Boolean(formik.errors['fiveDaysDiscount'])}
                helperText={formik.touched['fiveDaysDiscount'] && formik.errors['fiveDaysDiscount']}
              />
            </VStack>
          </Collapse>
          <TextField 
            name="distanceIncluded"
            label="Distance Included"
            value={formik.values.distanceIncluded}
            onChange={formik.handleChange}
            error={formik.touched.distanceIncluded && Boolean(formik.errors.distanceIncluded)}
            helperText={formik.touched.distanceIncluded && formik.errors.distanceIncluded}  
          />
          <SelectInput 
            multiple={true}
            className="text-input"
            name="highlights"
            label="Highlights"
            value={formik.values.highlights}
            onChange={formik.handleChange}
            options={highlightOptions}
            error={formik.touched.highlights && Boolean(formik.errors.highlights)}
            helperText={formik.touched.highlights && formik.errors.highlights}  
            required={false}
          />
          <SelectInput
            multiple={true}
            className="text-input"
            label="Features"
            name="features"
            value={formik.values.features}
            onChange={formik.handleChange}
            options={featureOptions}
            error={formik.touched.features && Boolean(formik.errors.features)}
            helperText={formik.touched.features && formik.errors.features}
            required={false}
          />
          <SelectInput
            multiple={true}
            className="text-input"
            label="Extras"
            name="extras"
            value={formik.values.extras}
            onChange={formik.handleChange}
            options={extraOptions}
            error={formik.touched.extras && Boolean(formik.errors.extras)}
            helperText={formik.touched.extras && formik.errors.extras}  
            required={false}
          />
          <FormControl component="fieldset" error={formik.touched.status && Boolean(formik.errors.status)}>
            <FormLabel component="legend">Bike Status</FormLabel>
            <RadioGroup
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="publish" control={<Radio />} label="Publish" />
              <FormControlLabel value="draft" control={<Radio />} label="Draft" />
            </RadioGroup>
            {formik.touched.status && formik.errors.status ? (
              <FormHelperText>{formik.errors.status}</FormHelperText>
            ) : null}
          </FormControl>
          <TextField 
            name="position"
            type='number'
            label="Position"
            value={formik.values.position}
            onChange={formik.handleChange}
            error={formik.touched.position && Boolean(formik.errors.position)}
            helperText={formik.touched.position && formik.errors.position}  
          />
        </VStack>
        {ActionButtons}
      </form>
    </FormWrapper>
  );
}