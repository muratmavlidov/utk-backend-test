import React, { useState } from "react";
import { Input, Button, Switch, toast } from "utkonos-ui";
import { sendDataFake, sendData, sendUploadImage, sendFakeUploadImage  } from "../../services/api";
import './style.scss';

interface IInitialFormData {
  phone: string
  email: string
  comment: string,
  image?: string
}

const initialFormData: IInitialFormData = {
  phone: '',
  email: '',
  comment: '',
}

const Form = () => {

  const [formData, setFormData] = useState({ ...initialFormData });

  const [errorsData, setErrorsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [apiUrl, setApiUrl] = useState('');

  const formSendSuccess = () => {
    setFormData(initialFormData)
    alert('Успешно!');
  }

  const sendFormData = checked ? sendData : sendDataFake;
  const sendImage = checked ? sendUploadImage : sendFakeUploadImage;

  const handleSubmit: JSX.IntrinsicElements['form']['onSubmit'] = (event) => {
    event.preventDefault();
    if (!formData.phone || !formData.email) {
      return alert('Заполните необходимые поля');
    };

    if (checked && !apiUrl) {
      return alert('Введите apiUrl');
    }

    setLoading(true);
    sendFormData(formData, apiUrl)
      .then(formSendSuccess)
      .catch(setErrorsData)
      .finally(() => setLoading(false));
  };

  const onFieldChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [name]: value });
  }

  const onApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrl(e.target.value);
  }

  const getError = (fieldName: string) => {
    if (!Array.isArray(errorsData)) return;
    // @ts-expect-error
    const error = errorsData?.find(({ name }) => name == fieldName)?.error;
    return error;
  }

  const imageUpload = (image: string) => {
    setFormData({ ...formData, image });
  }

  const onUploadFile = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (checked && !apiUrl) {
      return alert('Введите apiUrl');
    }
    const { files } = target;
    if (files) {
      for (let i = 0, f; f = files[i]; i++) {
        if (!f.type.match('image.*')) {
          alert("Допускаются только иизображения");
        }
        const reader = new FileReader();  
        reader.onload = (function (theFile) {
          return function () {
            const formData = new FormData();
            formData.set('image', theFile);
            sendImage(formData, apiUrl)
              .then(imageUpload)
          };
        })(f);
        reader.readAsDataURL(f);
      }
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
  }
  
  return (
    <form className="b-form" onSubmit={handleSubmit}>
      <div className="sb-inputWrapper">
        <Input value={formData.phone} error={getError("phone")} onChange={onFieldChange} className="b-form__field" type="tel" name="phone" label="Телефон" required />
        <Input value={formData.email} error={getError("email")} onChange={onFieldChange} className="b-form__field" type="text" name="email" label="Эл. почта" required />
        <Input value={formData.comment} error={getError("comment")} onChange={onFieldChange} className="b-form__field" as="textarea" rows={5} noResize name="comment" label="Комментарий" />

        {!formData.image && (
          <div className="b-form__fileBlock">
            <input type="file" id="actual-btn" hidden onChange={onUploadFile} />
            <label htmlFor="actual-btn">+</label>
          </div>
        )}

      {formData.image && (
        <div className="b-form__fileBlock b-form__fileBlock--image">
          <img src={formData.image} alt="" />
          <span className="b-form__imageDel" onClick={removeImage}>Удалить</span>
        </div>
      )}

        <Button type="submit" loading={loading}>Отправить</Button>
      </div>

      
      <label htmlFor="api-switch" className="b-form__label">
        <span>Ввести apiUrl</span>
        <Switch id="api-switch" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
      </label>

      {checked && (
        <Input onChange={onApiChange} className="b-form__apiField" type="text" name="api" placeholder="/api/v1" />
      )}

    </form>
  )                
}

export default Form;