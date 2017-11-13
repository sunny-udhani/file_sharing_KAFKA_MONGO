export const handleSubmitRegister = "handleSubmitRegister";
export const handleSubmitLogin = "handleSubmitLogin";
export const handleSubmitLogout = "handleSubmitLogout";

export function pushInput1(number) {
    return {
        type: handleInput1,
        number
    }
}

export function pushInput2(number) {
    return {
        type: handleInput2,
        number
    }

}
