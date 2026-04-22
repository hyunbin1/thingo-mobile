import RegisterForm from '../../components/organisms/Register/index';

/**
 * 회원가입 페이지
 *
 * 새로운 사용자 회원가입을 위한 페이지입니다.
 * 필수 정보와 개인 정보를 입력받습니다.
 */
const Register = () => {
  return (
    <div className='bg-grey-02 mx-auto flex min-h-screen w-full flex-1 flex-col p-4 md:p-12'>
      <p className='mb-4 text-2xl font-bold text-black md:text-4xl'>회원가입</p>
      <div className='flex items-center justify-center'>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
