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
} from '@mui/material';
import { FormWrapper } from './styles';
import Editor from 'react-simple-wysiwyg';
import { simplifyHtmlContent } from '@/utils/simplifyHtmlContent';
import { HStack, VStack } from '@/components/BikeAdmin/common/styles';
import { PinkButton } from '@/components/BikeAdmin/common/ActionButtons/styles';
import { BrandImagesUploader } from './GalleryImage/ImageUploader';
import { Brand } from '@/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import GeneralModal from '@/components/common/GeneralModal';
import { H1Title, ImgUpdated } from '@/components/BookingWizard/UpdatedInsurancePlanModal/styles';
import { useRouter } from 'next/router';
import { generateSlug } from '@/utils/helpers';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  slug: yup.string().matches(/^[A-Za-z0-9-]+$/, 'Slug can only contain letters, numbers, and dashes').required('Slug is required'),
  mediaItemId: yup.number().required('Please upload brand Image'),
  isPopular: yup.string().required('Status is required'), 
  revision: yup.string().required('Revision is required')
});

export function BikeBrandEdit({
  brand,
  setBrand,
  editId
} : {
  brand: Brand,
  setBrand: Dispatch<SetStateAction<Brand>>
  editId?: string
}) {
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const goDashboard = () => {
    router.push('/admin/brand');
    setIsOpenAlert(false);
  }

  const [brandName, setBrandName] = useState(brand.name || '');
  const formik = useFormik({
    initialValues: brand,
    validationSchema: validationSchema,
    onSubmit: values => {
      const token = localStorage.getItem("SESSION_ID");
      const payload = {
        name: values.name,
        slug: values.slug,
        mediaItemId: values.mediaItemId,
        isPopular: !!(Number(values.isPopular)),
        revision: simplifyHtmlContent(values.revision)
      };

      // Create
      if (!editId) {
        fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/brands`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload)
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === 200 || data.status === 201) {
              setIsSaving(false);
              setIsOpenAlert(true)
            } else {
              alert("An error occurred while create the bike.")
              setIsSaving(false);
            }
          })
          .catch(e => {
            alert("An exception occurred while create the bike.")
            setIsSaving(false);
            console.error(e);
          })
      } else { // update
        fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/brands/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload)
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === 200 || data.status === 201) {
              setIsSaving(false);
              setIsOpenAlert(true)
            } else {
              alert("An error occurred while update the bike.")
              setIsSaving(false);
            }
          })
          .catch(e => {
            alert("An exception occurred while update the bike.")
            setIsSaving(false);
            console.error(e);
          })
      }
    }
  });

  const setMediaItemId = (newValue: number) => {
    // Directly set the value within Formik's state
    formik.setFieldValue('mediaItemId', newValue);
  };

  useEffect(() => {
    if (formik.values.name) {
      const generatedSlug = generateSlug(formik.values.name);
      
      formik.setFieldValue("slug", generatedSlug);
      formik.setFieldTouched("slug");
    }
  }, [formik.values.name]);

  return (
    <FormWrapper>
      <form onSubmit={formik.handleSubmit}>
        <VStack style={{margin: '0 auto', maxWidth: '590px', padding: '70px 0'}}>
          <TextField
            name="name"
            label="Brand Name*"
            value={formik.values.name}
            onChange={(e) => {
              formik.handleChange(e);
              setBrandName(e.target.value);
            }}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}  
          />
          <TextField 
            name="slug"
            label="Slug"
            value={formik.values.slug}
            onChange={formik.handleChange}
            error={formik.touched.slug && Boolean(formik.errors.slug)}
            helperText={formik.touched.slug && formik.errors.slug}  
          />

          {/* Media item upload ui */}
          <BrandImagesUploader brand={brand} brandName={brandName} setBrand={setBrand} setMediaItemId={setMediaItemId} />
          <input
            type='hidden'
            name="mediaItemId"
            value={formik.values.mediaItemId || ''}
          />
          {formik.touched.mediaItemId && formik.errors.mediaItemId ? (
            <FormHelperText style={{color: '#d32f2f', marginLeft: '14px'}}>{formik.errors.mediaItemId as string}</FormHelperText>
          ) : null}

          <FormControl fullWidth error={formik.touched.revision && Boolean(formik.errors.revision)}>
            <FormLabel component="legend">Revision</FormLabel>
            <Editor
              value={formik.values.revision}
              onChange={(e) => {
                formik.setFieldValue("revision", e.target.value);
              }}
            />
            {formik.touched.revision && formik.errors.revision ? (
              <FormHelperText>{formik.errors.revision}</FormHelperText>
            ) : null}
          </FormControl>
        
          <FormControl component="fieldset" error={formik.touched.isPopular && Boolean(formik.errors.isPopular)}>
            <FormLabel component="legend">Brand Status</FormLabel>
            <RadioGroup
              name="isPopular"
              value={formik.values.isPopular}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="1" control={<Radio />} label="Popular" />
              <FormControlLabel value="0" control={<Radio />} label="Unpopular" />
            </RadioGroup>
            {formik.touched.isPopular && formik.errors.isPopular ? (
              <FormHelperText>{formik.errors.isPopular as string}</FormHelperText>
            ) : null}
          </FormControl>

          <HStack style={{justifyContent: 'center'}}>
            <PinkButton className='pink' type='submit'>{isSaving ? (editId ? 'Editing...' : 'Creating...') : (editId ? 'Edit' : 'Create')}</PinkButton>
          </HStack>
        </VStack>
      </form>

      <GeneralModal open={isOpenAlert} onClose={() => setIsOpenAlert(false)}>
        <VStack style={{alignItems: 'center', padding: '70px 0'}} spacing="30px">
          <ImgUpdated src="/images/updated_icon.svg" alt="updated_icon" />
          <H1Title>{editId ? 'Brand Updated!' : 'New Brand Created!'}</H1Title>
          <FormHelperText style={{marginTop: '-20px', fontSize: '16px'}}>{editId ? 'The brand has been updated successfully' : 'The new brand has been created successfully'}.</FormHelperText>
          <PinkButton className="pink" onClick={goDashboard} variant="contained" style={{width: '195px'}}>Go To Brands</PinkButton>
        </VStack>
      </GeneralModal>
    </FormWrapper>
  );
}