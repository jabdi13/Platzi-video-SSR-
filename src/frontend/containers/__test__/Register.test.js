import React from 'react';
import { create } from 'react-test-renderer';
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import ProviderMock from "../../__mocks__/providerMock";
import Register from "../Register";

configure({ adapter: new Adapter() });
try {
    describe('Register component', () => {
        test('Match Snapshot', () => {
            const register = create(
                <ProviderMock>
                    <Register/>
                </ProviderMock>,
            );
            expect(register.toJSON()).toMatchSnapshot();
        });

        it('Calls and executes preventDefautl function onSubmit form', () => {
            const preventDefault = jest.fn();
            const wrapper = mount(
                <ProviderMock>
                    <Register/>
                </ProviderMock>,
            );
            wrapper.find('form').simulate('submit', {preventDefault});
            expect(preventDefault).toHaveBeenCalledTimes(1);
            wrapper.unmount();
        });
    });
} catch (e) {
    console.error(e)
}
