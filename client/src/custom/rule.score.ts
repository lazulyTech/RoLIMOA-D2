import { CurrentMatchStateType } from '@/util/currentMatchStateType';

type ScoreOutputType = {
  value: number,
  refs?: Record<string, number>,
} | number;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function score(_stat: CurrentMatchStateType): ScoreOutputType {
  // ここにスコアの計算処理をかく
  //
  // config.json の rule.score に `"format": "implement"` を指定した場合のみ、
  // この実装が有効
  //
  // 例えば下記のようなケースでは、TypeScriptでの得点計算を実装するのでなく、
  // config.json の rule.score に `"format": "simple"` を指定する方が簡単
  //
  // ```
  // return _stat.taskObjects["A_1_point"] + _stat.taskObjects["B_10_point"] * 10;
  // ```

  if (_stat.taskObjects["Donuts"] < _stat.taskObjects["Donuts_Correct"]) {
    // _stat.taskObjects["Donuts_Correct"] = _stat.taskObjects["Donuts"];
  }
  let sum: number = 0;

  // 出荷点が関わる、お菓子の点数
  // 通常得点
  sum += 10 * _stat.taskObjects["Donuts"];
  sum += 10 * _stat.taskObjects["Muffin"];
  sum += 10 * _stat.taskObjects["Cake"];

  // 仕分け一致得点
  sum += 20 * _stat.taskObjects["Donuts_Correct"];
  sum += 20 * _stat.taskObjects["Muffin_Correct"];
  sum += 20 * _stat.taskObjects["Cake_Correct"];

  sum *= _stat.taskObjects["Shipping"];
  // 以上出荷関係

  // スタート得点
  sum += 10 * _stat.taskObjects["LeavePoint"];
  // オブジェクト接触得点
  sum += 10 * _stat.taskObjects["Touch"];
  // 出荷得点
  sum += 10 * (_stat.taskObjects["Shipping"] - 1);

  return sum;
}
