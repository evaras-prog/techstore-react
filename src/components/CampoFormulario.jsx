function CampoFormulario({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  placeholder = '',
  as = 'input',
  rows = 4,
  children,
}) {
  const clase = `${as === 'select' ? 'form-select' : 'form-control'} ${
    error ? 'is-invalid' : ''
  }`;
  const comunes = { id: name, name, value, onChange, className: clase };

  let control;
  if (as === 'select') {
    control = <select {...comunes}>{children}</select>;
  } else if (as === 'textarea') {
    control = <textarea {...comunes} rows={rows} placeholder={placeholder} />;
  } else {
    control = <input {...comunes} type={type} placeholder={placeholder} />;
  }

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      {control}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export default CampoFormulario;