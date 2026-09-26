export const dietaryPreferenceOptions = [
  { value: "calorie_control", label: "Kontrol kalori" },
  { value: "high_protein", label: "Tinggi protein" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "low_sodium", label: "Rendah garam" },
  { value: "non_spicy", label: "Tidak pedas" },
] as const;

export const allergyOptions = [
  { value: "peanut", label: "Kacang tanah" },
  { value: "tree_nut", label: "Kacang pohon" },
  { value: "seafood", label: "Makanan laut" },
  { value: "egg", label: "Telur" },
  { value: "milk", label: "Susu" },
  { value: "soy", label: "Kedelai" },
  { value: "gluten", label: "Gluten" },
] as const;

export function optionLabels(
  selected: string[],
  options: ReadonlyArray<{ value: string; label: string }>,
) {
  const labels = new Map(options.map((option) => [option.value, option.label]));
  return selected.map((value) => labels.get(value)).filter((label): label is string => Boolean(label));
}
