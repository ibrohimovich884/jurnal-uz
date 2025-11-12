import { useParams } from "react-router-dom";
import schedules from "../data/schedules";

export default function ClassPage() {
  const { className } = useParams();
  const schedule = schedules[className];

  if (!schedule) return <h2 style={{ padding: "2rem" }}>Bu sinf uchun jadval topilmadi.</h2>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{className.toUpperCase()} sinf jadvali</h1>
      <table border="1" cellPadding="8" style={{ marginTop: "1rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Kun</th>
            <th>Darslar</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((day, idx) => (
            <tr key={idx}>
              <td>{day.day}</td>
              <td>{day.subjects.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
