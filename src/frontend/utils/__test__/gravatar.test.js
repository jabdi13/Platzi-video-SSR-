import gravatar from "../gravatar";

describe('Gravatar function', () => {
    it('Should return gravatar default url', () => {
        const email = 'joe@example.com';
        const gravatarDefaultImage = 'https://gravatar.com/avatar/f5b8fb60c6116331da07c65b96a8a1d1';
        expect(gravatar(email)).toEqual(gravatarDefaultImage);
    });
});
