import React, { useState } from "react";
import { Input, Button, Switch, toast } from "utkonos-ui";
import { sendDataFake, sendData } from "../../services/api";
import './style.scss';

interface IInitialFormData {
  phone: string
  email: string
  comment: string
}

const initialFormData: IInitialFormData = {
  phone: '',
  email: '',
  comment: ''
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

  const apiFunc = checked ? sendData : sendDataFake;

  const handleSubmit: JSX.IntrinsicElements['form']['onSubmit'] = (event) => {
    event.preventDefault();
    if (!formData.phone || !formData.email) {
      return alert('Заполните необходимые поля');
    };

    if (checked && !apiUrl) {
      alert('Введите apiUrl');
    }

    setLoading(true);
    apiFunc(formData, apiUrl)
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

  console.log(initialFormData);
  
  return (
    <form className="b-form" onSubmit={handleSubmit}>
      <div className="sb-inputWrapper">
        <Input value={formData.phone} error={getError("phone")} onChange={onFieldChange} className="b-form__field" type="tel" name="phone" label="Телефон" required />
        <Input value={formData.email} error={getError("email")} onChange={onFieldChange} className="b-form__field" type="text" name="email" label="Эл. почта" required />
        <Input value={formData.comment} error={getError("comment")} onChange={onFieldChange} className="b-form__field" as="textarea" rows={5} noResize name="comment" label="Комментарий" />
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