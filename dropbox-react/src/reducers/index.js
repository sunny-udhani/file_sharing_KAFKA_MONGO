import {handleInput1, handleInput2, handleOperation} from "../actions/index";

const initial_state = {
    isLoggedIn: false,
    message: "",
    files: [],
};

const takeInput1 = (state = {initial_state}, action) => {
    state.input1 = action.number;
    return{
        ...state,
        [action.input1] : state.input1
    }
};

const takeInput2 = (state = {initial_state}, action) => {
    state.input2 = action.number;
    return{
        ...state,
        [action.input2] : state.input2
    }
};

const handleActions = (state = initial_state, action) => {

    switch (action.type) {
        case handleInput1 :
            return takeInput1(state, action);
        case handleInput2 :
            return takeInput2(state, action);
        default:
            return state;
    }
};

export default handleActions;