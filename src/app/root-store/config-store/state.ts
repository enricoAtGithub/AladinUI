import { EntityConfiguration } from 'src/app/shared/models/entity-configuration';

export interface ConfigState {
    configs: EntityConfiguration[] | null;
}

export const initialState: ConfigState = {
    configs: null,
};
