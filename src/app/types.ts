export type FormAction = ((formData: FormData) => void);
export type FormStateHandler<TPrevState = unknown> = ((prevState: TPrevState, formData: FormData) => Promise<any>);

export interface PageProps {
  params: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}
