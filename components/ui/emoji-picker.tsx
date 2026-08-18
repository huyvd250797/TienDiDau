"use client";

export function EmojiPicker({
  value,
  presets,
  onChange,
  label = "Icon",
}: {
  value: string;
  presets: string[];
  onChange: (value: string) => void;
  label?: string;
}) {
  const customValue = presets.includes(value) ? "" : value;

  return (
    <div className="field full">
      <span>{label}</span>
      <div className="choice-row">
        {presets.map((item) => (
          <button
            key={item}
            type="button"
            className={`choice-icon ${value === item ? "selected" : ""}`}
            onClick={() => onChange(item)}
            aria-label={`Chọn ${item}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="emoji-custom-row">
        <input
          value={customValue}
          maxLength={16}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Chạm để chọn Emoji 😀"
          aria-label="Emoji tùy chỉnh"
        />
        <span className="emoji-preview" aria-hidden="true">{value || "😀"}</span>
      </div>
      <small className="field-help">Không thấy icon phù hợp? Chạm ô trên và mở bàn phím Emoji của iPhone/Android để chọn biểu tượng bất kỳ.</small>
    </div>
  );
}
