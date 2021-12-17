import { useRef, useState } from 'react';
import DragDrop from '../../components/add/DragDrop';
import Button from '../../components/auth/Button';
import { useForm } from 'react-hook-form';
import { getLocationData } from '../../utils';
import {
  Background,
  BaseBox,
  CancelButton,
  FindLocation,
  Input,
  InputContainer,
  InputItem,
  InputLabel,
  TextArea,
  Title,
  Wrapper,
} from './styles';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const SEE_COFFEE_SHOP = gql`
  query seeCoffeeShop($id: Int!) {
    seeCoffeeShop(id: $id) {
      coffeeShop {
        id
        name
        latitude
        longitude
        address
        caption
        photos {
          id
          url
        }
      }
    }
  }
`;

const EDIT_COFFEESHOP_MUTATION = gql`
  mutation editCoffeeShop(
    $id: Int!
    $name: String
    $latitude: String
    $longitude: String
    $photoFiles: [Upload]
    $caption: String
  ) {
    editCoffeeShop(
      id: $id
      name: $name
      latitude: $latitude
      longitude: $longitude
      caption: $caption
      photoFiles: $photoFiles
    ) {
      ok
      error
    }
  }
`;

function Edit() {
  const { shopId } = useParams();

  const [address, setAddress] = useState(''); // 주소
  const [isOpenPost, setIsOpenPost] = useState(false);
  const latitude = useRef(0);
  const longitude = useRef(0);
  const [photoFiles, setPhotoFiles] = useState([]);

  const history = useHistory();

  const onChangeOpenPost = () => {
    setIsOpenPost(!isOpenPost);
  };

  const onCompletePost = async (data) => {
    let fullAddr = data.address;
    let extraAddr = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddr += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddr +=
          extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddr += extraAddr !== '' ? ` (${extraAddr})` : '';
    }

    setAddress(fullAddr);
    setIsOpenPost(false);

    const result = await getLocationData(fullAddr);
    latitude.current = result.documents[0].x;
    // console.log(result.documents[0].x); // 위도
    longitude.current = result.documents[0].y;
    // console.log(result.documents[0].y); // 경도
  };

  const { register, getValues, setValue, handleSubmit } = useForm({
    mode: 'onChange',
  });

  const onCompleted = (data) => {
    const {
      editCoffeeShop: { ok, error },
    } = data;
    if (!ok) {
      console.log({ error });
    } else {
      history.push('/');
    }
  };

  const [editCoffeeShop, { loading: editCoffeeLoading }] = useMutation(
    EDIT_COFFEESHOP_MUTATION,
    {
      onCompleted,
      variables: {
        id: Number(shopId),
      },
    }
  );

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    const { name, caption } = getValues();

    editCoffeeShop({
      variables: {
        name,
        caption,
        latitude: latitude.current,
        longitude: longitude.current,
        photoFiles: photoFiles.map((photoFile) => photoFile.object),
      },
    });
  };

  const { data, loading } = useQuery(SEE_COFFEE_SHOP, {
    variables: {
      id: Number(shopId),
    },
    onCompleted: (data) => {
      const {
        seeCoffeeShop: {
          coffeeShop: {
            id,
            name,
            address,
            caption,
            latitude: initLatitude,
            longitude: initLongitude,
          },
        },
      } = data;
      setValue('name', name);
      setAddress(address);
      setValue('caption', caption);
      latitude.current = initLatitude;
      longitude.current = initLongitude;
    },
  });

  return (
    <Background>
      <Wrapper>
        <BaseBox>
          <Title>Edit JakCa</Title>

          <DragDrop files={photoFiles} setFiles={setPhotoFiles} />
          <InputContainer onSubmit={handleSubmit(onSubmitValid)}>
            <InputItem>
              <InputLabel>Name of JakCa</InputLabel>
              <Input
                {...register('name', {
                  required: 'Name of JakCa is required.',
                })}
              />
            </InputItem>

            {address ? (
              <>
                <InputItem>
                  <InputLabel>Address</InputLabel>
                  <Input onClick={onChangeOpenPost} value={address} readOnly />
                </InputItem>
              </>
            ) : (
              <InputItem>
                <InputLabel>Location</InputLabel>
                <Input onFocus={onChangeOpenPost} />
              </InputItem>
            )}

            <InputItem>
              <InputLabel>Caption</InputLabel>
              <TextArea {...register('caption')} />
            </InputItem>
            <Button value={'Upload'} type='submit' />
            <CancelButton onClick={() => history.push('/')}>
              Cancel
            </CancelButton>
          </InputContainer>
        </BaseBox>
        {isOpenPost && <FindLocation autoClose onComplete={onCompletePost} />}
      </Wrapper>
    </Background>
  );
}
export default Edit;
