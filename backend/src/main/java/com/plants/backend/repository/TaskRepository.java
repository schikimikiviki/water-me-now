package com.plants.backend.repository;

import com.plants.backend.data.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByDate(LocalDate date);

    @Query("SELECT t FROM Task t WHERE EXTRACT(MONTH FROM t.date) = :month AND EXTRACT(DAY FROM t.date) = :day AND (t.isRepeated = false OR t.isRepeated IS NULL)")
    List<Task> findByMonthAndDay(@Param("month") int month, @Param("day") int day);


    @Query("SELECT t FROM Task t WHERE t.isRepeated = true")
    List<Task> findByIsRepeated();


}
