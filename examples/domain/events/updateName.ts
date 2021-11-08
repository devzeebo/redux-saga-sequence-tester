import {
  createAction,
} from '@reduxjs/toolkit';
import type {
  DomainObject,
} from '../models/DomainObject';

export type Update = {
  id: string,
  newName: string,
};

export const beginUpdate = createAction<Update>('domain/begin-update-name');
export const valueUpdated = createAction<DomainObject>('domain/name-updated');
