import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useState} from "react";
import "./modal.scss"
import {AuthActionsApi} from "../../data/api.ts";

const RegForm = ({onClose}: any) => {
    const [errors, setErrors] = useState('')
    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    };
    const validationSchema = Yup.object({
        email: Yup.string().email('Неверный формат email').required('Это поле обязательно для заполнения'),
        password: Yup.string().required('Это поле обязательно для заполнения').min(6, 'Пароль слишком короткий')
            .matches(/[a-zA-Z]/, 'Используйте только латинские буквы a-z'),
        confirmPassword: Yup.string().required('Это поле обязательно для заполнения')
            .oneOf([Yup.ref('password')], 'Пароли не совпадают'),
        name: Yup.string().required('Это поле обязательно для заполнения').min(4, 'Имя слишком короткое')
            .matches(/[a-zA-Z]/, 'Используйте только латинские буквы a-z')
    });
    const handleSubmit = async (email: string, password: string, confirmPassword: string, name: string) => {
        try{
            if (password !== confirmPassword) {
                throw new Error('Пароли не совпадают');
            }
            await new AuthActionsApi().registration({
                login:name,
                email:email,
                password:password
            })
            onClose()
        } catch {
            setErrors('errors')
        }
    }
    return (
        <>
            <div className={"form-header"}>Регистрация</div>
            <Formik initialValues={initialValues} validationSchema={validationSchema}
                    onSubmit={values => console.log(JSON.stringify(values))}>
                {({isSubmitting, isValid, dirty, values, resetForm}) => (
                    <Form>
                        <div className={"email-container"}>
                            Имя пользователя
                            <Field type='name' name='name' className={"form-field"}/>
                            <ErrorMessage name='name' component='div' className='ErrorMessages'/>
                        </div>
                        <div className={'email-container'}>
                            Адрес электронной почты
                            <Field type="email" name="email" className={"form-field"}/>
                            <ErrorMessage name="email" component="div" className="ErrorMessages"/>
                        </div>
                        <div className={'password-container'}>
                            Пароль
                            <Field type="password" name="password" className={"form-field"}/>
                            <ErrorMessage name="password" component="div" className="ErrorMessages"/>
                        </div>
                        <div className={'password-container'}>
                            Подтвердите пароль
                            <Field type="password" name="confirmPassword" className={"form-field"}/>
                            <ErrorMessage name="confirmPassword" component="div" className="ErrorMessages"/>
                        </div>
                        <div    className={'container-temp'}>
                        <button className={"submit-button"} type="submit" disabled={!(isValid && dirty) || isSubmitting} onClick={async () => {
                            isSubmitting = true
                            await handleSubmit(values.email, values.password, values.confirmPassword, values.name)
                            setTimeout(() => resetForm(), 500)
                        }}>
                            {isSubmitting ? 'Загрузка...' : 'Регистрация'}
                        </button>
                        {errors.length > 0 ? <div className={'error-messages'}>
                            {errors}
                        </div> : null}
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}
export default RegForm;