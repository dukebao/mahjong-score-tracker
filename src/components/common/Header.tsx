type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="pb-3">
      <div className="text-center">
        <h1 className="text-base font-semibold leading-tight text-slate-900">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-xs font-medium text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}