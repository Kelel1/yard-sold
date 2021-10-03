const validateRegisterInput = (
    email,
    password,
    confirmPassword
) => {
    const errors  = {};
    if(email.trim() === ''){
        errors.email = 'Email must not be empty';
    } else {
        const regEx = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if(!email.match(regEx)){
            errors.email = 'Email must be a valid address';
        }
    }
    if(password === ''){
        errors.password = 'Password must not be empty';
    } else if(password !== confirmPassword){
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

export { validateRegisterInput }