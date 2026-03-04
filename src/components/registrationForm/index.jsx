import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles.module.css";

function RegistrationForm() {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
  });

  const passwordValue = watch("password");

  const checkUsername = async (username) => {
    setIsCheckingUsername(true);
    try {
      const response = await fetch(
        `https://69a173e12e82ee536fa14300.mockapi.io/RegistrationForm?username=${username}`,
      );

      if (!response.ok) {
        console.error("Сервер недоступен");
        return true;
      }

      const data = await response.json();

      if (!Array.isArray(data)) return true;

      const isTaken = data.some(
        (user) => user.username.toLowerCase() === username.toLowerCase(),
      );

      return isTaken ? "Этот логин уже занят" : true;
    } catch (error) {
      return "Ошибка проверки логина";
    } finally {
      setIsCheckingUsername(false);
    }
  };

  /* --- Обработчик отправки формы ---*/

  const onSubmit = async (data) => {
    const { confirmPassword, agreement, ...userData } = data;

    try {
      const response = await fetch(
        "https://69a173e12e82ee536fa14300.mockapi.io/RegistrationForm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        },
      );

      if (response.ok) {
        const created = await response.json();
        console.log("Пользователь зарегистрирован:", created);
        reset();
      } else {
        console.error("Ошибка при регистрации:", response.status);
      }
    } catch (error) {
      console.error("Сетевая ошибка:", error);
    }
  };

  /* --- Рендер формы ---*/

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Registration Form</h1>

      <div className={styles.field}>
        <label className={styles.label}>Username</label>
        <input
          className={styles.input}
          placeholder="from 4 to 20 characters"
          {...register("username", {
            required: "Username обязателен",
            minLength: {
              value: 4,
              message: "Минимум 4 символа",
            },
            maxLength: {
              value: 20,
              message: "Максимум 20 символов",
            },
            pattern: {
              value: /^[A-Za-z0-9_]+$/,
              message: "Только латиница, цифры и нижнее подчёркивание",
            },
            validate: checkUsername,
          })}
        />

        {isCheckingUsername && (
          <p className={styles.hint}>⏳ Проверяем логин...</p>
        )}
        {errors.username && (
          <p className={styles.error}>{errors.username.message}</p>
        )}
      </div>

      {/* --- Email --- */}
      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="email"
          placeholder="example@mail.com"
          {...register("email", {
            required: "Email обязателен",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Некорректный формат email",
            },
          })}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
      </div>

      {/*  --- First Name ---  */}
      <div className={styles.field}>
        <label className={styles.label}>First Name</label>
        <input
          className={styles.input}
          placeholder="Только буквы, мин. 2"
          {...register("firstName", {
            required: "Имя обязательно",
            minLength: {
              value: 2,
              message: "Минимум 2 символа",
            },
            pattern: {
              value: /^[A-Za-zА-Яа-яЁё]+$/,
              message: "Только буквы (кириллица или латиница)",
            },
          })}
        />
        {errors.firstName && (
          <p className={styles.error}>{errors.firstName.message}</p>
        )}
      </div>

      {/* --- Last Name --- */}
      <div className={styles.field}>
        <label className={styles.label}>Last Name</label>
        <input
          className={styles.input}
          placeholder="Только буквы, мин. 2"
          {...register("lastName", {
            required: "Фамилия обязательна",
            minLength: {
              value: 2,
              message: "Минимум 2 символа",
            },
            pattern: {
              value: /^[A-Za-zА-Яа-яЁё]+$/,
              message: "Только буквы (кириллица или латиница)",
            },
          })}
        />
        {errors.lastName && (
          <p className={styles.error}>{errors.lastName.message}</p>
        )}
      </div>

      {/* --- Password --- */}
      <div className={styles.field}>
        <label className={styles.label}>Password</label>
        <input
          className={styles.input}
          type="password"
          placeholder="Мин. 6 символов"
          {...register("password", {
            required: "Пароль обязателен",
            minLength: {
              value: 6,
              message: "Минимум 6 символов",
            },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*\d).+$/,
              message: "Нужна хотя бы 1 заглавная буква и 1 цифра",
            },
          })}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}
      </div>

      {/* --- Confirm Password --- */}
      <div className={styles.field}>
        <label className={styles.label}>Confirm Password</label>
        <input
          className={styles.input}
          type="password"
          placeholder="Повторите пароль"
          {...register("confirmPassword", {
            required: "Подтвердите пароль",
            validate: (value) =>
              value === passwordValue || "Пароли не совпадают",
          })}
        />
        {errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* --- Age --- */}
      <div className={styles.field}>
        <label className={styles.label}>Age</label>
        <input
          className={styles.input}
          type="number"
          placeholder="18–100"
          {...register("age", {
            required: "Возраст обязателен",
            min: {
              value: 18,
              message: "Минимальный возраст — 18 лет",
            },
            max: {
              value: 100,
              message: "Максимальный возраст — 100 лет",
            },
          })}
        />
        {errors.age && <p className={styles.error}>{errors.age.message}</p>}
      </div>

      {/* --- Phone --- */}
      <div className={styles.field}>
        <label className={styles.label}>Phone</label>
        <input
          className={styles.input}
          placeholder="+XX XXXXXXXXXX"
          {...register("phone", {
            required: "Телефон обязателен",
            pattern: {
              value: /^\+\d{2}\s\d{10}$/,
              message: "Формат: +XX XXXXXXXXXX",
            },
          })}
        />
        {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
      </div>

      {/* --- checkbox --- */}
      <div className={styles.checkboxField}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            {...register("agreement", {
              required: "Вы должны согласиться с правилами",
            })}
          />
          Я согласен с правилами
        </label>
        {errors.agreement && (
          <p className={styles.error}>{errors.agreement.message}</p>
        )}
      </div>

      {/* --- Register --- */}
      <button
        className={styles.button}
        type="submit"
        disabled={!isValid || isSubmitting || isCheckingUsername}
      >
        {isSubmitting ? "Отправка..." : "Register"}
      </button>
    </form>
  );
}

export default RegistrationForm;
