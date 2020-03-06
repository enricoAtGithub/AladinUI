import { SettingsModel } from './setting.model';

export interface CategoryModel {
    category: string;
    description: string;
    settings: SettingsModel[];
}
