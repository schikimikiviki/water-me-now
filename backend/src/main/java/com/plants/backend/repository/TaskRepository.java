package com.plants.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.backend.data.Task;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

	List<Task> findByDate(LocalDate date);

	@Query("SELECT t FROM Task t WHERE EXTRACT(MONTH FROM t.date) = :month AND EXTRACT(DAY FROM t.date) = :day")
	List<Task> findByMonthAndDay(@Param("month") int month, @Param("day") int day);


}
