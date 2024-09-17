import { Match } from '../../models/Match';
import MatchProvider from '../MatchProvider/MatchProvider';

export function matchLoader(): Match {
  const match = MatchProvider.Instance.match;

  return match;
}
