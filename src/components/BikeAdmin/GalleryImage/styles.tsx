import styled from 'styled-components';
import { CameraAltOutlined, Close } from '@mui/icons-material';

export const ImgLabel = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px;

  margin-bottom: 10px;
`;

export const UploaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 6px;
  border: 1px dashed var(--Green, #00C3CE);
  background: var(--BG, #EFF7FB);
  display: flex;
  justify-content: center;
  align-items: center;
}
`;

export const UploadIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const UploadIcon = styled.div`
  background: #343434AB;
  border-radius: 50%;
  padding: 10px;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const CameraIcon = styled(CameraAltOutlined)`
  font-size: 30px;
  color: white;
`;

export const CloseIconWrapper = styled.div`
  background: #343434AB;
  border-radius: 50%;
  padding: 10px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
export const CloseIcon = styled(Close)`
  font-size: 20px;
  color: white;
`;

export const Description = styled.p`
  font-size: 16px;
  font-style: normal;
  line-height: 24px;
  color: var(--Primary, #343434);
  text-align: center;
`;
export const Helper = styled.p`
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 15px;
  color: var(--Primary, #343434);
  opacity: 0.3;
`;

export const GalleryImageWrapper = styled.div`
  min-width: 185px;
  height: 175px;
`;
