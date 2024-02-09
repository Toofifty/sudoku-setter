import { Navigate, Route, Routes } from 'react-router';

import SetterPage from 'modules/setter';
import PlayerPage from 'modules/player';

const Router = () => (
    <Routes>
        <Route path="/setter" element={<SetterPage />} />
        <Route path="/puzzle" element={<PlayerPage />} />
        <Route path="/" element={<Navigate replace to="/setter" />} />
    </Routes>
);

export default Router;
