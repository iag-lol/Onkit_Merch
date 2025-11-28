import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  data: { name: string; value: number }[];
  color?: string;
}

export const SimpleBar = ({ data, color = "#1DB9A0" }: Props) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="value" fill={color} radius={[10, 10, 6, 6]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
