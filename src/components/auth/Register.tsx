import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {AuthActionsApi} from "../../data/api.ts";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

function Register() {
    const navigate = useNavigate()
    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    };
    const validationSchema = Yup.object({
        email: Yup.string().email('Неверный формат email').required('Это поле обязательно для заполнения'),
        password: Yup.string().required('Это поле обязательно для заполнения').min(6, 'Пароль слишком короткий')
            .matches(/^[a-zA-Z]+$/, 'Используйте только латинские буквы a-z'),
        confirmPassword: Yup.string().required('Это поле обязательно для заполнения')
            .oneOf([Yup.ref('password')], 'Пароли не совпадают'),
        name: Yup.string().required('Это поле обязательно для заполнения').min(4, 'Имя слишком короткое')
            .matches(/^[a-zA-Z]+$/, 'Используйте только латинские буквы a-z')
    });
    const handleSubmit = async (email: string, password: string, name: string) => {
        try{
            await new AuthActionsApi().registration({
                login:name,
                email:email,
                password:password
            })
            navigate('/login')
        } catch (error) {
            toast.error("ошибка регистрации)")
        }
    }
    return (
        <div className={'container'}>
            <div className={'container-item'}>
                <div className={"form-header"}>Регистрация</div>
                <Formik initialValues={initialValues} validationSchema={validationSchema}
                        onSubmit={values => console.log(JSON.stringify(values))}>
                    {({isSubmitting, isValid, dirty, values, resetForm}) => (
                        <Form>
                            <div className={"email-container"}>
                                <Field placeholder={'Имя пользователя'} type='name' name='name'
                                       className={"form-field"}/>
                                <ErrorMessage name='name' component='div' className='ErrorMessages'/>
                            </div>
                            <div className={'email-container'}>

                                <Field placeholder={'Адрес электронной почты'} type="email" name="email"
                                       className={"form-field"}/>
                                <ErrorMessage name="email" component="div" className="ErrorMessages"/>
                            </div>
                            <div className={'password-container'}>

                                <Field placeholder={'Пароль'} type="password" name="password" className={"form-field"}/>
                                <ErrorMessage name="password" component="div" className="ErrorMessages"/>
                            </div>
                            <div className={'password-container'}>

                                <Field placeholder={'Подтвердите пароль'} type="password" name="confirmPassword"
                                       className={"form-field"}/>
                                <ErrorMessage name="confirmPassword" component="div" className="ErrorMessages"/>
                            </div>
                            <div className={'container-temp'}>
                                <button className={"submit-button"} type="submit"
                                        disabled={!(isValid && dirty) || isSubmitting} onClick={async () => {
                                    isSubmitting = true
                                    await handleSubmit(values.email, values.password, values.name)
                                    setTimeout(() => resetForm(), 500)
                                }}>
                                    {isSubmitting ? 'Загрузка...' : 'Регистрация'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default Register