import { FormArrow, FormDivider, FormRow, FormSection } from '@components';
import { connectComponent } from '@api/settings';
import { Locale, Scenes } from '@metro/common';
import * as Screens from '@screens/index';
import { getByTypeName } from '@metro';
import { create } from '@patcher';
import React from 'react';

import ThemeIcon from '@screens/partials/ThemeIcon';
import PluginIcon from '@screens/partials/PluginIcon';

const Patcher = create('enmity-settings');

export default function (): void {
  patchScreens();
  patchSettings();
}

function patchScreens() {
  Patcher.after(Scenes, 'default', (_, args, res) => {
    console.log('Scenes were called');
    return {
      ...res,
      Enmity: {
        key: 'Enmity',
        title: 'Enmity',
        render: connectComponent(Screens.Enmity.Page, 'enmity'),
        headerRight: Screens.Enmity.HeaderRight
      },
      EnmityPlugins: {
        key: 'EnmityPlugins',
        title: 'Plugins',
        render: Screens.Plugins.Page,
        headerRight: Screens.Plugins.HeaderRight
      },
      EnmityThemes: {
        key: 'EnmityThemes',
        title: 'Themes',
        render: Screens.Themes.Page,
        headerRight: Screens.Themes.HeaderRight
      }
    };
  });
}

function patchSettings() {
  const Settings = getByTypeName('UserSettingsOverviewWrapper', { default: false });
  const unpatch = Patcher.after(Settings, 'default', (_, __, ret) => {
    const { navigation } = ret.props;

    Patcher.after(ret.type.prototype, 'render', (_, args, res) => {
      const { children } = res.props;
      const index = children.findIndex(x => x.props.title === Locale.Messages['PREMIUM_SETTINGS']);

      children.splice(index, 0, <>
        <FormSection key='Enmity' title='Enmity'>
          <FormRow
            label='General'
            leading={<FormRow.Icon source={{ uri: 'https://files.enmity.app/icon-64.png' }} />}
            trailing={<FormArrow />}
            onPress={() => void navigation.push('Enmity')}
          />
          <FormDivider />
          <FormRow
            label='Plugins'
            leading={<PluginIcon width={24} height={24} />}
            trailing={<FormArrow />}
            onPress={() => void navigation.push('EnmityPlugins')}
          />
          <FormDivider />
          <FormRow
            label='Themes'
            leading={<ThemeIcon width={24} height={24} />}
            trailing={<FormArrow />}
            onPress={() => void navigation.push('EnmityThemes')}
          />
          <FormDivider />
        </FormSection>
      </>);
    });

    unpatch();
  });
}