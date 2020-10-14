import React from 'react';
import { Route } from 'react-router';

export default (
    <Route>
        <Route path="/" exact />
        <Route path="/admin" exact />
        <Route path="/game/:gameId" exact/>
    </Route>
);