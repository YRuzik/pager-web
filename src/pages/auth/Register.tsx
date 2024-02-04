import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {AuthActionsApi} from "../../data/api.ts";
import './AuthStyle.scss'
import React from "react";
import toast from "react-hot-toast";

interface RegisterProps{
    action:() =>void;
}

const Register: React.FC<RegisterProps> = ({ action }) => {
    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    };
    const validationSchema = Yup.object({
        email: Yup.string().email('Неверный формат email').required('Это поле обязательно для заполнения'),
        password: Yup.string().required('Это поле обязательно для заполнения').min(6, 'Пароль слишком короткий')
            .matches(/^[a-zA-Z0-9]+$/, 'Используйте только латинские буквы и цифры'),
        confirmPassword: Yup.string().required('Это поле обязательно для заполнения')
            .oneOf([Yup.ref('password')], 'Пароли не совпадают'),
        name: Yup.string().required('Это поле обязательно для заполнения').min(4, 'Имя слишком короткое')
            .matches(/^[a-zA-Z0-9]+$/, 'Используйте только латинские буквы и цифры')
    });
    const handleSubmit = async (email: string, password: string, name: string) => {
        await new AuthActionsApi().registration({
            login: name,
            email: email,
            password: password
        }).then(() => {
            action();
            toast.success("Замечательно! Теперь авторизуйтесь");
        });
    }
    return (
        <>
            <div className={"form-header"}>
                Регистрация
            </div>
            <Formik initialValues={initialValues} validationSchema={validationSchema}
                    onSubmit={async (values) =>
                        await handleSubmit(values.email, values.password, values.name)}>
                {({isSubmitting, isValid, dirty}) => (
                    <Form className={'form'}>
                        <div className={'field-container'}>
                            <Field placeholder={'Имя пользователя'} type='name' name='name'
                                   className={"form-field"}/>
                            <div className={'error-container'}>
                                <ErrorMessage name='name' component='div' className='ErrorMessages'/>
                            </div>
                        </div>
                        <div className={'field-container'}>
                            <Field placeholder={'Адрес электронной почты'} type="email" name="email"
                                   className={"form-field"}/>
                            <div className={'error-container'}>
                                <ErrorMessage name="email" component="div" className="ErrorMessages"/>
                            </div>
                        </div>
                        <div className={'field-container'}>
                            <Field placeholder={'Пароль'} type="password" name="password" className={"form-field"}/>
                            <div className={'error-container'}>
                                <ErrorMessage name="password" component="div" className="ErrorMessages"/>
                            </div>
                        </div>
                        <div className={'field-container'}>
                            <Field placeholder={'Подтвердите пароль'} type="password" name="confirmPassword"
                                   className={"form-field"}/>
                            <div className={'error-container'}>
                                <ErrorMessage name="confirmPassword" component="div" className="ErrorMessages"/>
                            </div>
                        </div>
                        <div className={'container-temp'}>
                            <button className={"submit-button"} type="submit"
                                    disabled={!(isValid && dirty) || isSubmitting}>
                                {isSubmitting ? 'Загрузка...' : 'Регистрация'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default Register