import { EntityConfiguration } from 'src/app/shared/models/entity-configuration';
import { GroupConfiguration } from 'src/app/shared/models/group-configuration';

export interface ConfigState {
    configs: EntityConfiguration[] | null;
    groupConfigs: GroupConfiguration[] | null;
}

export const initialState: ConfigState = {
    configs: null,
    groupConfigs: null
};
