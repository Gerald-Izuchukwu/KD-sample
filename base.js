// this code is not supposed to be here

const userSchema = ({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (value.length< 5) {
                throw new Error('Password length must be greater than 5')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email')
            }
        }
    },
    surname: {
      type: String  
    },
    firstname: {
        type: String
    },
    sex : {
        type: String,
        validate(value) {
            if (value!=='male' && value!=='female'){
                throw new Error ('Invalid sex')
            }
        }
    }
})

console.log(userSchema.password)