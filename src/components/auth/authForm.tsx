import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import "./modal.scss"
import {AuthActionsApi} from "../../data/api.ts";
import toast from "react-hot-toast";
import {RpcError} from "@protobuf-ts/runtime-rpc";

const AuthForm = ({onClose}: any) => {
    const initialValues = {
        identity: '',
        password: '',
    };

    const validationSchema = Yup.object({
        identity: Yup.string().required('Это поле обязательно для заполнения'),
        password: Yup.string()
            .required('Это поле обязательно для заполнения')
            .min(6, 'Пароль слишком короткий')
            .matches(/^[a-zA-Z]+$/, 'Используйте только латинские буквы a-z'),
    });

    const handleLogin = async (identity: string, password: string) => {
        try {
            await new AuthActionsApi().Login({
                identity: identity,
                password: password
            }).response.then(tokens => {
                localStorage.setItem("jwt", tokens.accessToken)
                localStorage.setItem("refreshToken", tokens.refreshToken)
            })
            onClose()
        } catch (e: unknown) {
            const error = e as RpcError;
            toast.error(error.message)
        }
    };

    return (
        <>
            <div className={"form-header"}>Вход</div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={values => console.log(JSON.stringify(values))}
            >
                {({isSubmitting, isValid, dirty, values, resetForm}) => (
                    <Form>
                        <div className={'email-container'}>
                            Логин / Почта
                            <Field type="identity" name="identity" className="form-field"/>
                            <ErrorMessage name="identity" component="div" className="ErrorMessages"/>
                        </div>
                        <div className={"password-container"}>
                            Пароль
                            <Field type="password" name="password" className="form-field"/>
                            <ErrorMessage name="password" component="div" className="ErrorMessages"/>
                        </div>
                        <div className={"container-temp"}>
                            <button className={"submit-button"}
                                    type="submit"
                                    disabled={!(isValid && dirty) || isSubmitting}
                                    onClick={async () => {
                                        isSubmitting = true;
                                        await handleLogin(values.identity, values.password);
                                        setTimeout(() => resetForm(), 500);
                                    }}
                            >
                                {isSubmitting ? 'Загрузка...' : 'Войти'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default AuthForm;
