import { useEffect, useState } from "react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { UserContext } from "../../context/userContext";
import { login } from "../../utils/authApi";
import { emailRegister, passwordRegister } from "../../utils/utils";
import { BaseButton } from "../BaseButton/BaseButton";
import { Form } from "../Form/Form";
import { openNotification } from "../Notification/Notification";
import "./style.scss";

const ErrorComponent = <div>Error</div>;

// handleSubmit - функция высшего порядка. Т.е. она принимает в себя другие функции.



// const  handleSubmit = (args, sendData) => {
// calculations
// sendData(calculations)
// }


export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });

  const { setAuthentificated } = useContext(UserContext);

  const sendData = async (data) => {
    try {
      const result = await login(data);
      localStorage.setItem(`token`, result.token);
      setAuthentificated(true);
      navigate("/");
    } catch (error) {
      openNotification("error", "Error", "Неверный логин/пароль");
      reset();
    }
  };
  const navigate = useNavigate();
  const location = useLocation();
  const initialPath = location.state?.initialPath;

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/register", {
      replace: true,
      state: { backgroundLocation: location, initialPath: initialPath },
    });
  };

  // setCurentUser = (e.target)=> {
  //   currentuser = [e.target.name]: e.target.value
  // }
    return (
      <>
          <Form handleFormSubmit={handleSubmit(sendData)} title="Вход">
            <div className="auth__controls">
              <input
                {...emailRegister(register)}
                className="auth__input"
                type="email"
                name="email"
                placeholder="Email"
              />
              {errors.email && (
                <p className="auth__error">{errors?.email?.message}</p>
              )}

              <input
                {...passwordRegister(register)}
                className="auth__input"
                type="password"
                name="password"
                placeholder="Пароль"
              />
              {errors.password && (
                <p className="auth__error">{errors?.password?.message}</p>
              )}
            </div>
            <p
              className="auth__info auth__link"
              onClick={() =>
                navigate("/reset-pass", {
                  replace: true,
                  state: { backgrounLocation: location, initialPath },
                })
              }
            >
              Восстановить пароль
            </p>
            <div className="auth__actions">
              <BaseButton type="submit" color={"yellow"}>
                Войти
              </BaseButton>
              <BaseButton type="button" color={"white"} onClick={handleClick}>
                Регистрация
              </BaseButton>
            </div>
          </Form>
      </>
    );

};
