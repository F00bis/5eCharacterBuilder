import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import type { Ability } from '../../../types';
import { getModifier } from '../../../utils/abilityScores';
import { calculateMaxHp, getArmorClassForDraft, useReviewStep } from './ReviewStepContext';

const ABILITY_ORDER: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

export default function ReviewStep() {
  const { state, dispatch } = useCharacterBuilder();
  const { finalCharacter, isValid, handleFinish } = useReviewStep();

  const maxHp = calculateMaxHp(state.draft, finalCharacter.level);
  const acBreakdown = getArmorClassForDraft(state.draft);
  const totalLevel = state.draft.classes?.reduce((sum, c) => sum + c.level, 0) ?? 0;

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-4">
      <div className="space-y-2">
        {state.mode === 'create' ? (
          <Input
            value={state.draft.name || ''}
            onChange={(e) => dispatch({ type: 'UPDATE_DRAFT', updates: { name: e.target.value } })}
            placeholder="Character Name"
            className="text-xl font-bold"
          />
        ) : (
          <h2 className="text-xl font-bold">{state.draft.name}</h2>
        )}
        <p className="text-slate-600">
          Level {totalLevel} {finalCharacter.race}
          {finalCharacter.classes?.map(c => ` ${c.className}`).join(' /')}
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Ability Scores</h3>
        <div className="flex gap-2 flex-wrap">
          {ABILITY_ORDER.map(ability => {
            const score = finalCharacter.abilityScores[ability];
            const mod = getModifier(score);
            return (
              <div key={ability} className="p-3 bg-slate-100 rounded text-center min-w-15">
                <div className="text-xs uppercase text-slate-500">{ability.slice(0, 3)}</div>
                <div className="text-lg font-bold">{score}</div>
                <div className="text-sm text-slate-600">{mod >= 0 ? `+${mod}` : mod}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-100 rounded">
          <div className="text-sm text-slate-500">Max HP</div>
          <div className="text-2xl font-bold">{maxHp || 0}</div>
        </div>
        <div className="p-4 bg-slate-100 rounded">
          <div className="text-sm text-slate-500">Armor Class</div>
          <div className="text-2xl font-bold">{acBreakdown.total}</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">This Session</h3>
        <div className="space-y-2 text-sm">
          {Object.keys(finalCharacter.featureChoices || {}).length > 0 && (
            <div>
              <span className="font-medium">Features: </span>
              {Object.entries(finalCharacter.featureChoices).map(([key, choice]) => (
                <span key={key} className="inline-block bg-purple-100 px-2 py-1 rounded mr-1">
                  {Array.isArray(choice) ? choice.join(', ') : choice}
                </span>
              ))}
            </div>
          )}
          {finalCharacter.equipment && finalCharacter.equipment.length > 0 && (
            <div>
              <span className="font-medium">Equipment: </span>
              {finalCharacter.equipment.map((item, i) => (
                <span key={i} className="inline-block bg-green-100 px-2 py-1 rounded mr-1">
                  {item.name}
                </span>
              ))}
            </div>
          )}
          {finalCharacter.feats && finalCharacter.feats.length > 0 && (
            <div>
              <span className="font-medium">Feats: </span>
              {finalCharacter.feats.map((feat, i) => (
                <span key={i} className="inline-block bg-blue-100 px-2 py-1 rounded mr-1">
                  {feat.name}
                </span>
              ))}
            </div>
          )}
          {!Object.keys(finalCharacter.featureChoices || {}).length &&
            (!finalCharacter.equipment || finalCharacter.equipment.length === 0) &&
            (!finalCharacter.feats || finalCharacter.feats.length === 0) && (
              <p className="text-slate-500 italic">No new acquisitions this session.</p>
            )}
        </div>
      </div>

      <Button
        onClick={handleFinish}
        disabled={!isValid}
        className="w-full"
        size="lg"
      >
        {state.mode === 'create' ? 'Save Character' : 'Complete Level Up'}
      </Button>
    </div>
  );
}
