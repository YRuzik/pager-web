import {ErrorMessage, Field, Form, Formik} from "formik";
import "./AuthStyle.scss"
import {useAuth} from "../../hooks/useAuth.tsx";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import CustomButton from "../../components/common/customButton/CustomButton.tsx";

function Login() {
    const {login} = useAuth();
    const navigate = useNavigate();
    const initialValues = {
        identity: '',
        password: '',
    };

    const validationSchema = Yup.object({
        identity: Yup.string().required('Это поле обязательно для заполнения'),
        password: Yup.string()
            .required('Это поле обязательно для заполнения')
            .min(6, 'Пароль слишком короткий')
            .matches(/^[a-zA-Z0-9]+$/, 'Используйте только латинские буквы и цифры')
    });
    const handleLogin = async (identity: string, password: string) => {
        await login(identity, password).catch((e) => toast.error(e)).then(() => navigate("/chat"))
    };
    return (
        <>
            <div className={"form-header"}>
                Вход
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    await handleLogin(values.identity, values.password);
                }}
            >
                {({isSubmitting, isValid, dirty}) => (
                    <Form className={'form'}>
                        <div className={'field-container'}>
                            <Field type="identity" name="identity" className="form-field"
                                   placeholder={'Логин / Почта'}/>
                            <div className={'error-container'}>
                                <ErrorMessage name="identity" component="div" className="ErrorMessages"/>
                            </div>
                        </div>
                        <div className={'field-container'}>
                            <Field type="password" name="password" className="form-field" placeholder={'Пароль'}/>
                            <div className={'error-container'}>
                                <ErrorMessage name="password" component="div" className="ErrorMessages"/>
                            </div>
                        </div>
                        <div className={"container-temp"}>
                            <CustomButton type="submit" disabled={!(isValid && dirty) || isSubmitting} onClick={() => {}}>
                                <div>
                                    {isSubmitting ? 'Загрузка...' : 'Войти'}
                                </div>
                            </CustomButton>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default Login