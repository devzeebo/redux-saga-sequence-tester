import {
  DomainObject,
} from './domain/models/DomainObject';

export default (
  id: string,
  newName: string,
): Promise<DomainObject> => (
  fetch(`https://some-domain.com/api/domain/${id}`, {
    method: 'POST',
    body: JSON.stringify({
      newName,
    }),
  })
    .then((data) => data.json() as Promise<DomainObject>)
);
