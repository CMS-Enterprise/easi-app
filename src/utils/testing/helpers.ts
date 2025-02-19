import { ByRoleMatcher, screen } from '@testing-library/react';
import i18next from 'i18next';

import { AlertProps } from 'components/Alert';
import { TaskStatus } from 'components/TaskStatusTag';
import fnErrorCapture from 'utils/fnErrorCapture';

export const expectTaskStatusTagToHaveTextKey = fnErrorCapture(
  (taskStatusTextKey: TaskStatus) => {
    expect(screen.getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>(`taskList:taskStatus.${taskStatusTextKey}`)
    );
  }
);

export const getByRoleWithNameTextKey = fnErrorCapture(
  (role: ByRoleMatcher, nameTextKey: string) => {
    return screen.getByRole(role, {
      name: i18next.t<string>(nameTextKey)
    });
  }
);

export const getExpectedAlertType = fnErrorCapture(
  (alertType: AlertProps['type']) => {
    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass(`usa-alert--${alertType}`);
    return alert;
  }
);
