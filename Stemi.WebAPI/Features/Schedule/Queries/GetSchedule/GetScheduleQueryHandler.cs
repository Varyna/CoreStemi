
	using global::Stemi.WebAPI.Data;
	using global::Stemi.WebAPI.Models.DTOs;
	using global::Stemi.WebAPI.Models.Entities;
	using MediatR;
	using Microsoft.EntityFrameworkCore;
	using System.Data;

	namespace Stemi.WebAPI.Features.Schedule.Queries.GetSchedule
	{
		public class GetScheduleQueryHandler : IRequestHandler<GetScheduleQuery, ScheduleResponse>
		{
			private readonly ApplicationDbContext _context;

			public GetScheduleQueryHandler(ApplicationDbContext context)
			{
				_context = context;
			}

			public async Task<ScheduleResponse> Handle(GetScheduleQuery request, CancellationToken cancellationToken)
			{
				var response = new ScheduleResponse();

				// Обработка даты
				var date = request.Date ?? DateTime.Now.Date;
				var day = ((int)date.DayOfWeek + 6) % 7 + 1;
				if (day == 7)
					date = date.AddDays(1);

				// Обработка корпуса
				var corpus = request.Corpus ?? 1;

				var theadInformationDtos = new List<TheadInformationDto>();

				// Получение данных из базы
				var lessons = await GetLessonsByDate(date, corpus, cancellationToken);
				var directoryTimes = await GetDirectoryTimes(cancellationToken);

				if (lessons.Count != 0)
				{
					var groups = lessons.Select(x => x.DirectoryGroup)
						.OrderBy(x => x.Name)
						.DistinctBy(x => x.Id);

					foreach (var group in groups)
					{
						var lessonsGroup = lessons.Where(x => x.DirectoryGroup.Id == group.Id)
							.OrderBy(x => x.DirectoryTime.Id)
							.ToList();

						var theadInfo = new TheadInformationDto
						{
							DirectoryTimes = directoryTimes,
							GroupName = group.Name
						};

						foreach (var time in directoryTimes)
						{
							var lesson = lessonsGroup.FirstOrDefault(x => x.DirectoryTime.Id == time.Id);

							if (lesson != null)
							{
								theadInfo.TimeTable.Add(CreateTimeTableDto(
									lesson.Subject,
									lesson.DirectoryCabinets.Name,
									lesson.NumberLecture,
									lesson.DirectoryTime.Name,
									lesson.Teacher
								));
							}
							else
							{
								theadInfo.TimeTable.Add(CreateTimeTableDto(
									null, null, time.Id, time.Name, null
								));
							}
						}
						theadInformationDtos.Add(theadInfo);
					}
				}

				// Создание таблиц
				response.GroupInformations = new List<GroupInformationDto>();
				var dataTables = new List<DataTable>();

				if (theadInformationDtos.Count < 6)
				{
					dataTables.Add(CreateDataTable(theadInformationDtos));
					response.GroupInformations.Add(_currentGroupInformation);
				}
				else
				{
					var chunkSize = (theadInformationDtos.Count - 1) / 2 + 1;
					var partitions = Partition(theadInformationDtos, chunkSize);

					foreach (var partition in partitions)
					{
						dataTables.Add(CreateDataTable(partition));
						response.GroupInformations.Add(_currentGroupInformation);
					}
				}

				dataTables = RemoveEmptyRows(dataTables);
				response.Tables = dataTables;
				response.Corpus = corpus;
				response.Date = date;

				return response;
			}

			private async Task<List<Lesson>> GetLessonsByDate(DateTime date, int corpus, CancellationToken cancellationToken)
			{
				return await _context.Lessons
					.Include(l => l.DirectoryGroup)
					.Include(l => l.DirectoryTime)
					.Include(l => l.DirectoryCabinets)
					.Where(l => l.Date == date && l.Corpus == corpus)
					.ToListAsync(cancellationToken);
			}

			private async Task<List<DirectoryTime>> GetDirectoryTimes(CancellationToken cancellationToken)
			{
				return await _context.DirectoryTimes
					.OrderBy(dt => dt.Id)
					.ToListAsync(cancellationToken);
			}

			private GroupInformationDto _currentGroupInformation = new();

			private List<DataTable> RemoveEmptyRows(List<DataTable> dataTables)
			{
				foreach (var dataTable in dataTables)
				{
					var rowsToRemove = new List<int>();

					for (int rowIndex = 0; rowIndex < dataTable.Rows.Count; rowIndex++)
					{
						var emptyCellCount = 0;
						for (int columnIndex = 0; columnIndex < dataTable.Columns.Count; columnIndex++)
						{
							var cellValue = dataTable.Rows[rowIndex][columnIndex].ToString();
							if (string.IsNullOrEmpty(cellValue))
								emptyCellCount++;
						}

						// Удаляем строку, если все ячейки кроме первой (время) пустые
						if (emptyCellCount == dataTable.Columns.Count - 1)
							rowsToRemove.Add(rowIndex);
					}

					// Удаляем строки с конца чтобы не сбивать индексы
					for (int i = rowsToRemove.Count - 1; i >= 0; i--)
					{
						dataTable.Rows.RemoveAt(rowsToRemove[i]);
					}
				}

				return dataTables;
			}

			private IEnumerable<List<T>> Partition<T>(List<T> values, int chunkSize)
			{
				for (int i = 0; i < values.Count; i += chunkSize)
				{
					yield return values.Skip(i).Take(chunkSize).ToList();
				}
			}

			private DataTable CreateDataTable(List<TheadInformationDto> theadInformationDtos)
			{
				_currentGroupInformation = new GroupInformationDto();
				var dataTable = new DataTable();
				var cabinetIndex = 0;

				// Добавляем столбец для времени
				dataTable.Columns.Add(" ");

				// Добавляем столбцы для кабинетов и групп
				foreach (var theadInfo in theadInformationDtos)
				{
					var cabinetColumn = dataTable.Columns.Add($"КАБ{cabinetIndex}");
					cabinetColumn.Caption = theadInfo.Kab;
					dataTable.Columns.Add(theadInfo.GroupName);
					cabinetIndex++;
				}

				// Добавляем строки с временем
				if (theadInformationDtos.Count > 0)
				{
					for (int i = 0; i < theadInformationDtos[0].DirectoryTimes.Count; i++)
					{
						dataTable.Rows.Add(theadInformationDtos[0].DirectoryTimes[i].Name);
					}
				}

				// Заполняем данными
				for (int rowIndex = 0; rowIndex < dataTable.Rows.Count; rowIndex++)
				{
					var time = dataTable.Rows[rowIndex][0].ToString();

					for (int columnIndex = 1; columnIndex < dataTable.Columns.Count; columnIndex++)
					{
						var columnName = dataTable.Columns[columnIndex].ColumnName;

						if (!columnName.Contains("КАБ"))
						{
							// Добавляем название группы в информацию о группах
							if (rowIndex == 0)
								_currentGroupInformation.Group.Add(columnName);

							// Находим соответствующий TimeTableDto
							var theadInfo = theadInformationDtos.FirstOrDefault(x => x.GroupName == columnName);
							var timeTableEntry = theadInfo?.TimeTable.FirstOrDefault(x => x.Time == time);

							// Заполняем ячейки
							dataTable.Rows[rowIndex][columnIndex] = timeTableEntry?.TextColumn() ?? "";
							dataTable.Rows[rowIndex][columnIndex - 1] = timeTableEntry?.Cabinet ?? "";
						}
					}
				}

				return dataTable;
			}

			private TimeTableDto CreateTimeTableDto(string? subject, string? cabinet, int numberLecture, string time, string? teacher)
			{
				return new TimeTableDto
				{
					Cabinet = cabinet,
					NumberLecture = numberLecture,
					Subject = subject,
					Time = time,
					Teacher = teacher
				};
			}
		}
	}
