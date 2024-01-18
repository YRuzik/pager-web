import profile from "../data/mobx/profile.ts";

const MockAuth = () => {
    return (
        <div>
            <button onClick={() => {
                profile.setUserId("65a919c07d03dfb14351b157")
            }}>
                user 1
            </button>
            <button onClick={() => {
                profile.setUserId("65a9195b7d03dfb14351b154")
            }}>
                user 2
            </button>
        </div>
    )
}

export default MockAuth