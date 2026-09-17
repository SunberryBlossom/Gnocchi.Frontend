import Button from '@mui/material/Button';
import { useState } from 'react';
import { Signin } from '../services/AuthService';

function SigninPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        await Signin(email, password);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" variant="contained" color="primary">
                Sign In
            </Button>
        </form>
    )
}

export { SigninPage }